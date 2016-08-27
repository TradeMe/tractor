/* global describe:true, it:true */
'use strict';

// Constants:
import constants from '../constants';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import ComponentFile from '../files/ComponentFile';
import Directory from './Directory';
import File from '../files/File';
import MockDataFile from '../files/MockDataFile';
import path from 'path';

// Under test:
import FileStructure from './FileStructure';

describe('server/file-structure: FileStructure:', () => {
    describe('FileStructure constructor:', () => {
        it('should create a new FileStructure', () => {
            let fileStructure = new FileStructure();

            expect(fileStructure).to.be.an.instanceof(FileStructure);
        });

        it('should initalise it\'s interal data structures', () => {
            let fileStructure = new FileStructure();

            expect(fileStructure.allFiles).to.deep.equal([]);
            expect(fileStructure.allFilesByPath).to.deep.equal({});
            expect(fileStructure.allDirectories.length).to.equal(1);
            expect(Object.keys(fileStructure.allDirectoriesByPath).length).to.equal(1);
            expect(fileStructure.references).to.deep.equal({});
        });

        it('should create the root directory', () => {
            sinon.stub(process, 'cwd').returns('');

            let fileStructure = new FileStructure();

            expect(fileStructure.structure).to.be.an.instanceof(Directory);
            expect(fileStructure.structure.path).to.equal('e2e-tests');

            process.cwd.restore();
        });
    });

    describe('FileStructure.read', () => {
        it('should read the entire file structure', () => {
            sinon.stub(Directory.prototype, 'read').returns(Promise.resolve());
            sinon.stub(process, 'cwd').returns('');

            let fileStructure = new FileStructure();

            return fileStructure.read()
            .then(() => {
                expect(fileStructure.allDirectoriesByPath[path.join('e2e-tests', 'components')]).not.to.be.undefined();
                expect(fileStructure.allDirectoriesByPath[path.join('e2e-tests', 'features')]).not.to.be.undefined();
                expect(fileStructure.allDirectoriesByPath[path.join('e2e-tests', 'mock-data')]).not.to.be.undefined();
                expect(fileStructure.allDirectoriesByPath[path.join('e2e-tests', 'step-definitions')]).not.to.be.undefined();

                const READ_COUNT = 4;
                expect(Directory.prototype.read).to.have.callCount(READ_COUNT);
            })
            .finally(() => {
                Directory.prototype.read.restore();
                process.cwd.restore();
            });
        });
    });

    describe('FileStructure.getStructure:', () => {
        it('should return the structure for a given type of file:', () => {
            let directory = {};

            sinon.stub(Directory.prototype, 'getDirectory').returns(directory);

            let fileStructure = new FileStructure();

            let structure = fileStructure.getStructure();

            expect(structure).to.deep.equal({
                /* eslint-disable no-undefined */
                // `availableComponents` and `availableMockData` are both expected
                // to be `undefined` rather than empty arrays, because they will
                // be omitted from the JSON response if they are not needed.
                availableComponents: undefined,
                availableMockData: undefined,
                /* eslint-enable no-undefined */
                directory,
                references: { }
            });

            Directory.prototype.getDirectory.restore();
        });

        it('should return all the available Components if type is "step-definitions"', () => {
            let directory = {
                addFile: _.noop
            };
            let component1 = new ComponentFile('some/path/to/component1', directory);
            let component2 = new ComponentFile('some/path/to/component2', directory);

            sinon.stub(Directory.prototype, 'getDirectory').returns(directory);

            let fileStructure = new FileStructure();
            fileStructure.addFile(component1);
            fileStructure.addFile(component2);

            let structure = fileStructure.getStructure('step-definitions');

            expect(structure).to.deep.equal({
                availableComponents: [component1, component2],
                availableMockData: [],
                directory,
                references: { }
            });

            Directory.prototype.getDirectory.restore();
        });

        it('should return all the available MockData if type is "step-definitions"', () => {
            let directory = {
                addFile: _.noop
            };
            let mockData1 = new MockDataFile(path.join('some', 'path', 'to', 'mockData1'), directory);
            let mockData2 = new MockDataFile(path.join('some', 'path', 'to', 'mockData2'), directory);

            sinon.stub(Directory.prototype, 'getDirectory').returns(directory);

            let fileStructure = new FileStructure();
            fileStructure.addFile(mockData1);
            fileStructure.addFile(mockData2);

            let structure = fileStructure.getStructure('step-definitions');

            expect(structure).to.deep.equal({
                availableComponents: [],
                availableMockData: [mockData1, mockData2],
                directory,
                references: { }
            });

            Directory.prototype.getDirectory.restore();
        });
    });

    describe('FileStructure.copyFile:', () => {
        it('should create an exact copy a file', () => {
            let directory = {
                addFile: _.noop,
                extension: '',
                files: [],
                path: 'some/path/to/directory'
            };
            let file = new File(path.join('some', 'path', 'to', 'directory', 'file'), directory);
            file.content = 'content';
            directory.files.push(file);

            sinon.spy(directory, 'addFile');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let fileStructure = new FileStructure();
            fileStructure.addFile(file);

            return fileStructure.copyFile(path.join('some', 'path', 'to', 'directory', 'file'))
            .then(() => {
                expect(directory.addFile).to.have.been.calledWith({
                    content: 'content',
                    directory,
                    name: 'file (1)',
                    path: path.join('some', 'path', 'to', 'directory', 'file (1)')
                });
                expect(File.prototype.save).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
            });
        });

        it('should update the name of the metadata if a file has an AST', () => {
            let directory = {
                addFile: _.noop,
                extension: '.js',
                files: [],
                path: 'some/path/to/directory'
            };
            let file = new File(path.join('some', 'path', 'to', 'directory', 'file.js'), directory);
            file.ast = {
                comments: [{
                    value: JSON.stringify({ name: 'file' })
                }]
            };
            directory.files.push(file);

            sinon.spy(directory, 'addFile');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let fileStructure = new FileStructure();
            fileStructure.addFile(file);

            return fileStructure.copyFile(path.join('some', 'path', 'to', 'directory', 'file.js'))
            .then(() => {
                expect(directory.addFile).to.have.been.calledWith({
                    ast: {
                        comments: [{
                            value: JSON.stringify({ name: 'file (1)' })
                        }]
                    },
                    directory,
                    name: 'file (1)',
                    path: path.join('some', 'path', 'to', 'directory', 'file (1).js')
                });
                expect(File.prototype.save).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
            });
        });

        it('should throw an error if it can\'t find the file to copy', () => {
            let fileStructure = new FileStructure();

            return fileStructure.copyFile(path.join('path', 'to', 'something', 'that', 'doesnt', 'exist'))
            .catch((error) => {
                expect(error.name).to.equal('TractorError');
                expect(error.message).to.equal(path.join(`Could not find "${path.join('path', 'to', 'something', 'that', 'doesnt', 'exist')}"`));
                expect(error.status).to.deep.equal(constants.FILE_NOT_FOUND_ERROR);
            });
        });
    });

    describe('FileStructure.createDirectory:', () => {
        it('should create a new Directory', () => {
            let directory = {
                addDirectory: _.noop,
                directories: []
            };

            sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());

            let fileStructure = new FileStructure();
            fileStructure.allDirectoriesByPath[path.join('path', 'to', 'some', 'directory')] = directory;

            return fileStructure.createDirectory(path.join('path', 'to', 'some', 'directory'))
            .then(() => {
                expect(Directory.prototype.save).to.have.been.calledOnce();

                let newDirectorySaveCall = Directory.prototype.save.getCall(0);
                let newDirectory = newDirectorySaveCall.thisValue;

                expect(newDirectory.name).to.equal('New Directory (1)');
                expect(newDirectory.path).to.equal(path.join('path', 'to', 'some', 'directory', 'New Directory (1)'));
            })
            .finally(() => {
                Directory.prototype.save.restore();
            });
        });
    });

    describe('FileStructure.deleteItem:', () => {
        it('should delete a file', () => {
            let file = {
                delete: _.noop
            };

            sinon.stub(file, 'delete').returns(Promise.resolve());

            let fileStructure = new FileStructure();
            fileStructure.allFilesByPath[path.join('path', 'to', 'some', 'file')] = file;

            return fileStructure.deleteItem(path.join('path', 'to', 'some', 'file'))
            .then(() => {
                expect(file.delete).to.have.been.called();
            });
        });

        it('should delete a directory', () => {
            let directory = {
                delete: _.noop
            };

            sinon.stub(directory, 'delete').returns(Promise.resolve());

            let fileStructure = new FileStructure();
            fileStructure.allDirectoriesByPath[path.join('path', 'to', 'some', 'directory')] = directory;

            return fileStructure.deleteItem(path.join('path', 'to', 'some', 'directory'))
            .then(() => {
                expect(directory.delete).to.have.been.called();
            });
        });

        it('should throw an error if it can\'t find the item to delete', () => {
            let fileStructure = new FileStructure();

            return fileStructure.deleteItem(path.join('path', 'to', 'something', 'that', 'doesnt', 'exist'))
            .catch((error) => {
                expect(error.name).to.equal('TractorError');
                expect(error.message).to.equal(path.join(`Could not find "${path.join('path', 'to', 'something', 'that', 'doesnt', 'exist')}"`));
                expect(error.status).to.deep.equal(constants.FILE_NOT_FOUND_ERROR);
            });
        });
    });

    describe('FileStructure.openFile:', () => {
        it('should open a file', () => {
            let file = {
                read: _.noop
            };

            sinon.stub(file, 'read').returns(Promise.resolve());

            let fileStructure = new FileStructure();
            fileStructure.allFilesByPath[path.join('path', 'to', 'some', 'file')] = file;

            return fileStructure.openFile(path.join('path', 'to', 'some', 'file'))
            .then((toOpen) => {
                expect(file.read).to.have.been.called();
                expect(toOpen).to.equal(file);
            });
        });

        it('should throw an error if it can\'t find the file to open', () => {
            let fileStructure = new FileStructure();

            return fileStructure.openFile(path.join('path', 'to', 'something', 'that', 'doesnt', 'exist'))
            .catch((error) => {
                expect(error.name).to.equal('TractorError');
                expect(error.message).to.equal(path.join(`Could not find "${path.join('path', 'to', 'something', 'that', 'doesnt', 'exist')}"`));
                expect(error.status).to.deep.equal(constants.FILE_NOT_FOUND_ERROR);
            });
        });
    });

    describe('FileStructure.saveFile:', () => {
        it('should save an existing file', () => {
            let file = {
                save: _.noop
            };

            sinon.stub(file, 'save').returns(Promise.resolve());

            let fileStructure = new FileStructure();
            fileStructure.allFilesByPath[path.join('path', 'to', 'some', 'file')] = file;

            return fileStructure.saveFile(null, 'data', path.join('path', 'to', 'some', 'file'))
            .then(() => {
                expect(file.save).to.have.been.calledWith('data');
            });
        });

        it('should save a new file', () => {
            let directory = {
                addFile: _.noop
            };

            sinon.stub(ComponentFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(Directory.prototype, 'getDirectory').returns(directory);

            let fileStructure = new FileStructure();

            return fileStructure.saveFile('components', 'data', path.join('path', 'to', 'some', 'file'))
            .then(() => {
                expect(ComponentFile.prototype.save).to.have.been.calledWith('data');
            })
            .finally(() => {
                Directory.prototype.getDirectory.restore();
                ComponentFile.prototype.save.restore();
            });
        });
    });

    describe('FileStructure.addFile:', () => {
        it('should add a file to the fileStructure', () => {
            let file = {
                path: path.join('path', 'to', 'some', 'file')
            };

            let fileStructure = new FileStructure();
            fileStructure.addFile(file);

            expect(fileStructure.allFiles.length).to.equal(1);
            expect(_.last(fileStructure.allFiles)).to.equal(file);
            expect(Object.keys(fileStructure.allFilesByPath).length).to.equal(1);
            expect(fileStructure.allFilesByPath[path.join('path', 'to', 'some', 'file')]).to.equal(file);
        });

        it('should not add the file it has already been added', () => {
            let file = {
                path: path.join('path', 'to', 'some', 'file')
            };

            let fileStructure = new FileStructure();
            fileStructure.addFile(file);
            fileStructure.addFile(file);

            expect(fileStructure.allFiles.length).to.equal(1);
        });
    });

    describe('FileStructure.removeFile:', () => {
        it('should remove a file from the fileStructure', () => {
            let file = {
                path: path.join('path', 'to', 'some', 'file')
            };

            let fileStructure = new FileStructure();
            fileStructure.allFilesByPath[path.join('path', 'to', 'some', 'file')] = file;
            fileStructure.allFiles.push(file);

            fileStructure.removeFile(file);

            expect(fileStructure.allFiles.length).to.equal(0);
            expect(fileStructure.allFilesByPath[path.join('path', 'to', 'some', 'file')]).to.be.undefined();
        });
    });

    describe('FileStructure.addDirectory', () => {
        it('should add a directory to the fileStructure', () => {
            let directory = {
                path: path.join('path', 'to', 'some', 'directory')
            };

            let fileStructure = new FileStructure();
            fileStructure.addDirectory(directory);

            expect(fileStructure.allDirectories.length).to.equal(2);
            expect(_.last(fileStructure.allDirectories)).to.equal(directory);
            expect(Object.keys(fileStructure.allDirectoriesByPath).length).to.equal(2);
            expect(fileStructure.allDirectoriesByPath[path.join('path', 'to', 'some', 'directory')]).to.equal(directory);
        });

        it('should not add the directory it has already been added', () => {
            let directory = {
                path: path.join('path', 'to', 'some', 'directory')
            };

            let fileStructure = new FileStructure();
            fileStructure.addDirectory(directory);
            fileStructure.addDirectory(directory);

            expect(fileStructure.allDirectories.length).to.equal(2);
        });
    });

    describe('FileStructure.removeDirectory:', () => {
        it('should remove a directory from the fileStructure', () => {
            let directory = {
                path: path.join('path', 'to', 'some', 'directory')
            };

            let fileStructure = new FileStructure();
            fileStructure.allDirectoriesByPath[path.join('path', 'to', 'some', 'directory')] = directory;
            fileStructure.allDirectories.push(directory);
            fileStructure.removeDirectory(directory);

            expect(fileStructure.allDirectories.length).to.equal(1);
            expect(fileStructure.allDirectoriesByPath[path.join('path', 'to', 'some', 'directory')]).to.be.undefined();
        });
    });
});
