/* global describe:true, it:true */

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import constants from '../constants';
import File from '../files/File';
import fs from 'fs';
import path from 'path';

// Under test:
import Directory from './Directory';

describe('server/file-structure: Directory:', () => {
    describe('Directory constructor:', () => {
        it('should create a new Directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };

            let directory = new Directory(directoryPath, null, fileStructure);

            expect(directory).to.be.an.instanceof(Directory);
        });

        it('should work out the directory name from the `path`', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };

            let directory = new Directory(directoryPath, null, fileStructure);

            expect(directory.name).to.equal('directory');
        });

        it('should copy properties from it\'s parent', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop,
                extension: 'parentExtension',
                type: 'parentType'
            };

            let directory = new Directory(directoryPath, parent, fileStructure);

            expect(directory.extension).to.equal('parentExtension');
            expect(directory.type).to.equal('parentType');
        });

        it('should use its name as its type if its parent doesn\'t have a type', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop,
                extension: 'parentExtension'
            };

            let directory = new Directory(directoryPath, parent, fileStructure);

            expect(directory.type).to.equal('directory');
        });

        it('should look up the extension for its type if its parent doesn\'t have an extension', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop
            };

            constants.EXTENSIONS.directory = 'directoryExtension';

            let directory = new Directory(directoryPath, parent, fileStructure);

            expect(directory.extension).to.equal('directoryExtension');

            delete constants.DIRECTORY_EXTENSION;
        });
    });

    describe('Directory.read:', () => {
        it('should read the directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop
            };

            sinon.stub(fs, 'readdirAsync').returns(Promise.resolve([]));

            let directory = new Directory(directoryPath, parent, fileStructure);

            return directory.read()
            .then(() => {
                expect(fs.readdirAsync).to.have.been.called.with('some/path/to/directory');
            })
            .finally(() => {
                fs.readdirAsync.restore();
            });
        });

        it('should read any directories contained within the Directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop
            };
            let stat = {
                isDirectory: _.noop
            };

            sinon.spy(Directory.prototype, 'read');
            let readdirAsync = sinon.stub(fs, 'readdirAsync');
            readdirAsync.onCall(0).returns(Promise.resolve(['subdirectory']));
            readdirAsync.onCall(1).returns(Promise.resolve([]));
            sinon.stub(fs, 'statAsync').returns(Promise.resolve(stat));
            sinon.stub(stat, 'isDirectory').returns(true);

            let directory = new Directory(directoryPath, parent, fileStructure);

            return directory.read()
            .then(() => {
                expect(fs.statAsync).to.have.been.called.with(path.join('some', 'path', 'to', 'directory', 'subdirectory'));
                expect(Directory.prototype.read).to.have.been.calledTwice();
            })
            .finally(() => {
                Directory.prototype.read.restore();
                fs.readdirAsync.restore();
                fs.statAsync.restore();
            });
        });

        it('should read any files contained within the Directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop,
                addFile: _.noop
            };
            let parent = {
                addDirectory: _.noop,
                addFile: _.noop
            };
            let stat = {
                isDirectory: _.noop
            };

            sinon.stub(File.prototype, 'read').returns(Promise.resolve());
            sinon.stub(fs, 'readdirAsync').returns(Promise.resolve(['file']));
            sinon.stub(fs, 'statAsync').returns(Promise.resolve(stat));
            sinon.stub(stat, 'isDirectory').returns(false);

            let directory = new Directory(directoryPath, parent, fileStructure);
            directory.type = 'components';

            return directory.read()
            .then(() => {
                expect(fs.statAsync).to.have.been.called.with('some/path/to/directory/file');
                expect(File.prototype.read).to.have.been.called();
            })
            .finally(() => {
                File.prototype.read.restore();
                fs.readdirAsync.restore();
                fs.statAsync.restore();
            });
        });
    });

    describe('Directory.save:', () => {
        it('should save the directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop
            };

            sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());

            let directory = new Directory(directoryPath, parent, fileStructure);

            return directory.save()
            .then(() => {
                expect(fs.mkdirAsync).to.have.been.calledWith(path.join('some', 'path', 'to', 'directory'));
            })
            .finally(() => {
                fs.mkdirAsync.restore();
            });
        });

        it('should add the directory to it\'s parent', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop
            };

            sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
            sinon.stub(parent, 'addDirectory');

            let directory = new Directory(directoryPath, parent, fileStructure);

            return directory.save()
            .then(() => {
                expect(parent.addDirectory).to.have.been.calledWith(directory);
            })
            .finally(() => {
                fs.mkdirAsync.restore();
            });
        });

        it('should save all it\'s sub-directories', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop
            };
            let subdirectory = {
                save: _.noop
            };

            sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
            sinon.stub(parent, 'addDirectory');
            sinon.stub(subdirectory, 'save');

            let directory = new Directory(directoryPath, parent, fileStructure);
            directory.directories.push(subdirectory);

            return directory.save()
            .then(() => {
                expect(subdirectory.save).to.have.been.called();
            })
            .finally(() => {
                fs.mkdirAsync.restore();
            });
        });

        it('should save all it\'s files', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop
            };
            let file = {
                save: _.noop
            };

            sinon.stub(file, 'save');
            sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
            sinon.stub(parent, 'addDirectory');

            let directory = new Directory(directoryPath, parent, fileStructure);
            directory.files.push(file);

            return directory.save()
            .then(() => {
                expect(file.save).to.have.been.called();
            })
            .finally(() => {
                fs.mkdirAsync.restore();
            });
        });
    });

    describe('Directory.delete:', () => {
        it('should delete the directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());

            let directory = new Directory(directoryPath, parent, fileStructure);

            return directory.delete()
            .then(() => {
                expect(fs.rmdirAsync).to.have.been.calledWith(path.join('some', 'path', 'to', 'directory'));
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should remove the directory from it\'s parent', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(parent, 'removeDirectory');

            let directory = new Directory(directoryPath, parent, fileStructure);

            return directory.delete()
            .then(() => {
                expect(parent.removeDirectory).to.have.been.calledWith(directory);
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should delete all it\'s sub-directories', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };
            let subdirectory = {
                delete: _.noop
            };

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(parent, 'removeDirectory');
            sinon.stub(subdirectory, 'delete');

            let directory = new Directory(directoryPath, parent, fileStructure);
            directory.directories.push(subdirectory);

            return directory.delete()
            .then(() => {
                expect(subdirectory.delete).to.have.been.called();
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should save all it\'s files', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };
            let parent = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };
            let file = {
                delete: _.noop
            };

            sinon.stub(file, 'delete');
            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(parent, 'addDirectory');

            let directory = new Directory(directoryPath, parent, fileStructure);
            directory.files.push(file);

            return directory.delete()
            .then(() => {
                expect(file.delete).to.have.been.called();
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });
    });

    describe('Directory.addFile:', () => {
        it('should add a file to the directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let file = {};
            let fileStructure = {
                addDirectory: _.noop,
                addFile: _.noop
            };

            let directory = new Directory(directoryPath, null, fileStructure);

            directory.addFile(file);

            expect(directory.files.length).to.equal(1);
            let [expectedFile] = directory.files;
            expect(expectedFile).to.equal(file);
        });

        it('should not add the file if it has already been added', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let file = {};
            let fileStructure = {
                addDirectory: _.noop,
                addFile: _.noop
            };

            let directory = new Directory(directoryPath, null, fileStructure);

            directory.addFile(file);
            directory.addFile(file);

            expect(directory.files.length).to.equal(1);
        });

        it('should add the file to the fileStructure', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let file = {};
            let fileStructure = {
                addDirectory: _.noop,
                addFile: _.noop
            };

            sinon.stub(fileStructure, 'addFile');

            let directory = new Directory(directoryPath, null, fileStructure);

            directory.addFile(file);

            expect(fileStructure.addFile).to.have.been.calledWith(file);
        });
    });

    describe('Directory.removeFile:', () => {
        it('should remove a file from the directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let file = {};
            let fileStructure = {
                addDirectory: _.noop,
                removeFile: _.noop
            };

            let directory = new Directory(directoryPath, null, fileStructure);
            directory.files.push(directory);

            directory.removeFile(file);

            expect(directory.files.length).to.equal(0);
        });

        it('should remove the file from the fileStructure', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let file = {};
            let fileStructure = {
                addDirectory: _.noop,
                removeFile: _.noop
            };

            sinon.stub(fileStructure, 'removeFile');

            let directory = new Directory(directoryPath, null, fileStructure);
            directory.files.push(directory);

            directory.removeFile(file);

            expect(fileStructure.removeFile).to.have.been.calledWith(file);
        });
    });

    describe('Directory.addDirectory:', () => {
        it('should add a directory to the directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let subdirectory = {};

            let directory = new Directory(directoryPath, null, fileStructure);

            directory.addDirectory(subdirectory);

            expect(directory.directories.length).to.equal(1);
            let [expectedDirectory] = directory.directories;
            expect(expectedDirectory).to.equal(subdirectory);
        });

        it('should not add the directory if it has already been added', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let subdirectory = {};

            let directory = new Directory(directoryPath, null, fileStructure);

            directory.addDirectory(subdirectory);
            directory.addDirectory(subdirectory);

            expect(directory.directories.length).to.equal(1);
        });

        it('should add the directory to the fileStructure', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let subdirectory = {};

            sinon.stub(fileStructure, 'addDirectory');

            let directory = new Directory(directoryPath, null, fileStructure);

            directory.addDirectory(subdirectory);

            expect(fileStructure.addDirectory).to.have.been.calledWith(subdirectory);
        });
    });

    describe('Directory.removeDirectory', () => {
        it('should remove a directory from the directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };
            let subdirectory = {};

            let directory = new Directory(directoryPath, null, fileStructure);
            directory.directories.push(subdirectory);

            directory.removeDirectory(subdirectory);

            expect(directory.directories.length).to.equal(0);
        });

        it('should remove the directory from the fileStructure', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop,
                removeDirectory: _.noop
            };
            let subdirectory = {};

            sinon.stub(fileStructure, 'removeDirectory');

            let directory = new Directory(directoryPath, null, fileStructure);
            directory.directories.push(subdirectory);

            directory.removeDirectory(subdirectory);

            expect(fileStructure.removeDirectory).to.have.been.calledWith(subdirectory);
        });
    });

    describe('Directory.getDirectory:', () => {
        it('should return the directory with the given name', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop
            };
            let subdirectory = {
                name: 'directory'
            };

            let directory = new Directory(directoryPath, null, fileStructure);
            directory.addDirectory(subdirectory);

            expect(directory.getDirectory('directory')).to.equal(subdirectory);
        });
    });

    describe('Directory.toJSON:', () => {
        it('should return important properties of the directory', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let file = {};
            let fileStructure = {
                addDirectory: _.noop,
                addFile: _.noop
            };
            let subdirectory = {};

            let directory = new Directory(directoryPath, null, fileStructure);
            directory.addDirectory(subdirectory);
            directory.addFile(file);

            expect(directory.toJSON()).to.deep.equal({
                directories: [{}],
                files: [{}],
                name: 'directory',
                path: path.join('some', 'path', 'to', 'directory'),
                isDirectory: true
            });
        });

        it('should order the directories in alphabetic order', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let fileStructure = {
                addDirectory: _.noop,
                addFile: _.noop
            };
            let subdirectory1 = { name: 'z' };
            let subdirectory2 = { name: 'a' };

            let directory = new Directory(directoryPath, null, fileStructure);
            directory.addDirectory(subdirectory1);
            directory.addDirectory(subdirectory2);

            expect(directory.toJSON()).to.deep.equal({
                directories: [{ name: 'a' }, { name: 'z' }],
                files: [],
                name: 'directory',
                path: path.join('some', 'path', 'to', 'directory'),
                isDirectory: true
            });
        });

        it('should order the files in alphabetic order', () => {
            let directoryPath = path.join('some', 'path', 'to', 'directory');
            let file1 = { name: 'z' };
            let file2 = { name: 'a' };
            let fileStructure = {
                addDirectory: _.noop,
                addFile: _.noop
            };

            let directory = new Directory(directoryPath, null, fileStructure);
            directory.addFile(file1);
            directory.addFile(file2);

            expect(directory.toJSON()).to.deep.equal({
                directories: [],
                files: [{ name: 'a' }, { name: 'z' }],
                name: 'directory',
                path: path.join('some', 'path', 'to', 'directory'),
                isDirectory: true
            });
        });
    });
});
