/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import File from './File';
import FileStructure from './FileStructure';
import { extensions, registerFileType, types } from '../file-types';
import fs from 'fs';
import path from 'path';
import { TractorError } from 'tractor-error-handler';

// Under test:
import Directory from './Directory';

describe('tractor-file-structure - Directory:', () => {
    describe('Directory constructor:', () => {
        it('should create a new Directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            expect(directory).to.be.an.instanceof(Directory);
        });

        it('should work out the directory name from the `path`', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            expect(directory.name).to.equal('directory');
        });

        it('should work out the URL to the directory from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            expect(directory.url).to.equal('/directory/');
            expect(fileStructure.structure.url).to.equal('/');
        });

        it('should work out the parent directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            expect(subdirectory.directory).to.equal(directory);
        });

        it(`should create the parent directory if it doesn't exist`, () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'sub-directory'), fileStructure);

            expect(subdirectory.directory).to.not.be.undefined();
            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'parent-directory')]).to.not.be.undefined();
            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'parent-directory', 'directory')]).to.not.be.undefined();
        });

        it('should throw an error if the Directory path is outside the root of the FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(() => {
                new Directory(path.join(path.sep, 'outside'), fileStructure);
            }).to.throw(TractorError, `Cannot create "${path.join(path.sep, 'outside')}" because it is outside of the root of the FileStructure`);
        });
    });

    describe('Directory.addItem:', () => {
        it('should add a file to the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.extension'), fileStructure);

            directory.addItem(file);

            expect(directory.files.length).to.equal(1);
            let [expectedFile] = directory.files;
            expect(expectedFile).to.equal(file);
        });

        it('should not add the file if it has already been added', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.extension'), fileStructure);

            directory.addItem(file);
            directory.addItem(file);

            expect(directory.files.length).to.equal(1);
        });

        it('should add the file to the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fileStructure, 'addItem');

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.extension'), fileStructure);
            directory.addItem(file);

            expect(fileStructure.addItem).to.have.been.calledWith(file);
        });

        it('should add a directory to the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            directory.addItem(subdirectory);

            expect(directory.directories.length).to.equal(1);
            let [expectedDirectory] = directory.directories;
            expect(expectedDirectory).to.equal(subdirectory);
        });

        it('should not add the directory if it has already been added', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            directory.addItem(subdirectory);
            directory.addItem(subdirectory);

            expect(directory.directories.length).to.equal(1);
        });

        it('should add the directory to the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fileStructure, 'addItem');

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            directory.addItem(subdirectory);

            expect(fileStructure.addItem).to.have.been.calledWith(subdirectory);
        });
    });

    describe('Directory.cleanup:', () => {
        it('should delete the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'delete').returns(Promise.resolve());
            sinon.stub(directory.directory, 'cleanup').returns(Promise.resolve());

            return directory.cleanup()
            .then(() => {
                expect(directory.delete).to.have.been.called();
            });
        });

        it('should cleanup the parent directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'delete').returns(Promise.resolve());
            sinon.stub(directory.directory, 'cleanup').returns(Promise.resolve());

            return directory.cleanup()
            .then(() => {
                expect(directory.directory.cleanup).to.have.been.called();
            });
        });

        it('should stop once it gets to the root of the FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.spy(directory, 'delete');
            sinon.spy(directory.directory, 'delete');

            return directory.cleanup()
            .then(() => {
                expect(directory.delete).to.have.been.called();
                expect(directory.directory.delete).to.have.been.called();
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should stop once it gets to a directory that is not empty', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.extenstion'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.spy(directory, 'delete');
            sinon.spy(file, 'delete');
            sinon.spy(subdirectory, 'delete');

            return subdirectory.cleanup()
            .then(() => {
                expect(fs.rmdirAsync).to.have.been.calledOnce();
                expect(subdirectory.delete).to.have.been.called();
                expect(directory.delete).to.have.been.called();
                expect(file.delete).to.not.have.been.called();
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            })
        });

        it('should rethrow if something unexpected goes wrong', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.reject(new Error('Unexpected error')));

            return directory.cleanup()
            .catch(e => {
                expect(e).to.deep.equal(new Error('Unexpected error'));
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });
    });

    describe('Directory.copy:', () => {
        it('should save the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let toCopy = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let copy = new Directory(path.join(path.sep, 'file-structure', 'copy'), fileStructure);

            sinon.stub(copy, 'save').returns(Promise.resolve());

            return copy.copy(toCopy)
            .then(() => {
                expect(copy.save).to.have.been.called();
            });
        });

        it('should should copy all the directories inside the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let toCopy = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subDirectory1 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-1'), fileStructure);
            let subDirectory2 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-2'), fileStructure);
            let copy = new Directory(path.join(path.sep, 'file-structure', 'copy'), fileStructure);

            sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());
            sinon.spy(Directory.prototype, 'copy');

            return copy.copy(toCopy)
            .then(() => {
                expect(Directory.prototype.copy).to.have.been.calledWith(subDirectory1);
                expect(Directory.prototype.copy).to.have.been.calledWith(subDirectory2);
            })
            .finally(() => {
                Directory.prototype.save.restore();
                Directory.prototype.copy.restore();
            });
        });

        it('should should copy all the files inside the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let toCopy = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file1 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-1.extension'), fileStructure);
            let file2 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-2.extension'), fileStructure);
            let copy = new Directory(path.join(path.sep, 'file-structure', 'copy'), fileStructure);

            sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.spy(File.prototype, 'copy');

            return copy.copy(toCopy)
            .then(() => {
                expect(File.prototype.copy).to.have.been.calledWith(file1);
                expect(File.prototype.copy).to.have.been.calledWith(file2);
            })
            .finally(() => {
                Directory.prototype.save.restore();
                File.prototype.save.restore();
                File.prototype.copy.restore();
            });
        });
    });

    describe('Directory.delete:', () => {
        it('should delete the directory if it is empty', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());

            return directory.delete()
            .then(() => {
                expect(fs.rmdirAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory'));
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should remove itself from its parent directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(fileStructure.structure, 'removeItem');

            return directory.delete()
            .then(() => {
                expect(fileStructure.structure.removeItem).to.have.been.calledWith(directory);
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should remove itself from the FileStructure if it is the root directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(fileStructure, 'removeItem');

            return fileStructure.structure.delete()
            .then(() => {
                expect(fileStructure.removeItem).to.have.been.calledWith(fileStructure.structure);
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should throw if the directory is not empty', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.extenstion'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.spy(file, 'delete');
            sinon.spy(subdirectory, 'delete');

            return directory.delete()
            .catch(e => {
                expect(e).to.deep.equal(new TractorError(`Cannot delete "${directory.path}" because it is not empty`));
                expect(subdirectory.delete).to.not.have.been.called();
                expect(file.delete).to.not.have.been.called();
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        })
    });

    describe('Directory.getFiles:', () => {
        it('should return all files within a directory', () => {
            class TestFile extends File { }
            TestFile.extension = '.extension';
            TestFile.type = 'test-file';

            class OtherTestFile extends File { }
            TestFile.extension = '.other.extension';
            TestFile.type = 'test-file';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file1 = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file1.extension'), fileStructure);
            let file2 = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file2.extension'), fileStructure);
            let file3 = new OtherTestFile(path.join(path.sep, 'file-structure', 'directory', 'file3.other.extension'), fileStructure);

            let files = directory.getFiles();

            expect(files).to.deep.equal([file1, file2, file3]);
        });

        it('should return all files of a given Type within a directory', () => {
            class TestFile extends File { }
            TestFile.extension = '.extension';
            TestFile.type = 'test-file';

            class OtherTestFile extends File { }
            TestFile.extension = '.other.extension';
            TestFile.type = 'test-file';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file1 = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file1.extension'), fileStructure);
            let file2 = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file2.extension'), fileStructure);
            let file3 = new OtherTestFile(path.join(path.sep, 'file-structure', 'directory', 'file3.other.extension'), fileStructure);

            let files = directory.getFiles(OtherTestFile);

            expect(files.indexOf(file1)).to.equal(-1);
            expect(files.indexOf(file2)).to.equal(-1);
            expect(files).to.deep.equal([file3]);
        });
    });

    describe('Directory.read:', () => {
        it('should read the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'readdirAsync').returns(Promise.resolve([]));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            return directory.read()
            .then(() => {
                expect(fs.readdirAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));
            })
            .finally(() => {
                fs.readdirAsync.restore();
            });
        });

        it('should read any directories contained within the Directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stat = {
                isDirectory: () => {}
            };

            sinon.spy(Directory.prototype, 'read');
            let readdirAsync = sinon.stub(fs, 'readdirAsync');
            readdirAsync.onCall(0).returns(Promise.resolve(['directory']));
            readdirAsync.onCall(1).returns(Promise.resolve([]));
            sinon.stub(fs, 'statAsync').returns(Promise.resolve(stat));
            sinon.stub(stat, 'isDirectory').returns(true);

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            return directory.read()
            .then(() => {
                expect(fs.statAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));
                expect(Directory.prototype.read).to.have.been.calledTwice();
            })
            .finally(() => {
                Directory.prototype.read.restore();
                fs.readdirAsync.restore();
                fs.statAsync.restore();
            });
        });

        it('should create a model for any files contained within the Directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stat = {
                isDirectory: () => {}
            };

            sinon.stub(fs, 'readdirAsync').returns(Promise.resolve(['file.extension']));
            sinon.stub(fs, 'statAsync').returns(Promise.resolve(stat));
            sinon.stub(stat, 'isDirectory').returns(false);

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            return directory.read()
            .then(() => {
                expect(fs.statAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.extension'));
                expect(directory.files.length).to.equal(1);
            })
            .finally(() => {
                fs.readdirAsync.restore();
                fs.statAsync.restore();
            });
        });

        it('should create a rich model for files of a known type', () => {
            class TestFile extends File { }
            TestFile.extension = '.extension';
            TestFile.type = 'test-file';

            registerFileType(TestFile);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);
            let stat = {
                isDirectory: () => {}
            };

            sinon.stub(File.prototype, 'read');
            sinon.stub(fs, 'readdirAsync').returns(Promise.resolve(['file.extension']));
            sinon.stub(fs, 'statAsync').returns(Promise.resolve(stat));
            sinon.stub(stat, 'isDirectory').returns(false);

            return directory.read()
            .then(() => {
                expect(fs.statAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.extension'));
                let [file] = directory.files;
                expect(file instanceof TestFile).to.equal(true);
            })
            .finally(() => {
                File.prototype.read.restore();
                fs.readdirAsync.restore();
                fs.statAsync.restore();
                delete extensions['test-file'];
                delete types['.extension'];
            });
        });

        it('should create a rich model for files of a known type with multiple extensions', () => {
            class SpecialTestFile extends File { }
            SpecialTestFile.extension = '.special.extension';
            SpecialTestFile.type = 'special-test-file';

            sinon.stub(SpecialTestFile.prototype, 'save').returns(Promise.resolve());

            registerFileType(SpecialTestFile);

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);
            let stat = {
                isDirectory: () => {}
            };

            sinon.stub(File.prototype, 'read');
            sinon.stub(fs, 'readdirAsync').returns(Promise.resolve(['file.special.extension']));
            sinon.stub(fs, 'statAsync').returns(Promise.resolve(stat));
            sinon.stub(stat, 'isDirectory').returns(false);

            return directory.read()
            .then(() => {
                expect(fs.statAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.special.extension'));
                let [file] = directory.files;
                expect(file instanceof SpecialTestFile).to.equal(true);
            })
            .finally(() => {
                File.prototype.read.restore();
                fs.readdirAsync.restore();
                fs.statAsync.restore();
                delete extensions['special-test-file'];
                delete types['.special.extension'];
            });
        });
    });

    describe('Directory.removeItem:', () => {
        it('should remove a file from the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.extension'), fileStructure);

            directory.removeItem(file);

            expect(directory.files.length).to.equal(0);
        });

        it('should remove the file from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fileStructure, 'removeItem');

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.extension'), fileStructure);
            directory.files.push(file);

            directory.removeItem(file);

            expect(fileStructure.removeItem).to.have.been.calledWith(file);
        });

        it('should remove a directory from the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            directory.removeItem(subdirectory);

            expect(directory.directories.length).to.equal(0);
        });

        it('should remove the directory from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fileStructure, 'removeItem');

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            directory.removeItem(subdirectory);

            expect(fileStructure.removeItem).to.have.been.calledWith(subdirectory);
        });
    });

    describe('Directory.rimraf:', () => {
        it('should delete the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            return directory.rimraf()
            .then(() => {
                expect(fs.rmdirAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should remove itself from its parent', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let parent = new Directory(path.join(path.sep, 'file-structure', 'parent-directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(parent, 'removeItem');

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            return directory.rimraf()
            .then(() => {
                expect(parent.removeItem).to.have.been.calledWith(directory);
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should remove itself from the FileStructure if it is the root direction', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(fileStructure, 'removeItem');

            return fileStructure.structure.rimraf()
            .then(() => {
                expect(fileStructure.removeItem).to.have.been.calledWith(fileStructure.structure);
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should delete all its sub-directories', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'sub-directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(subdirectory, 'rimraf');

            return directory.rimraf()
            .then(() => {
                expect(subdirectory.rimraf).to.have.been.called();
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });

        it('should delete all its files', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.extension'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').returns(Promise.resolve());
            sinon.stub(file, 'delete');

            return directory.rimraf()
            .then(() => {
                expect(file.delete).to.have.been.called();
            })
            .finally(() => {
                fs.rmdirAsync.restore();
            });
        });
    });

    describe('Directory.save:', () => {
        it('should should do nothing if the directory already exists', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            sinon.stub(fs, 'statAsync').returns(Promise.resolve());
            sinon.spy(fs, 'mkdirAsync')

            return directory.save()
            .then(() => {
                expect(fs.statAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));
                expect(fs.mkdirAsync).to.not.have.been.called();
            })
            .finally(() => {
                fs.statAsync.restore();
                fs.mkdirAsync.restore();
            });
        });

        it(`should save the directory if it doesn't exist yet`, () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            sinon.stub(fs, 'statAsync').returns(Promise.reject(new Error()));
            sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());

            return directory.save()
            .then(() => {
                expect(fs.mkdirAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));
            })
            .finally(() => {
                fs.mkdirAsync.restore();
            });
        });
    });

    describe('Directory.toJSON:', () => {
        it('should return important properties of the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.extension'), fileStructure);

            expect(directory.toJSON()).to.deep.equal({
                directories: [subdirectory],
                files: [file],
                isDirectory: true,
                name: 'directory',
                path: path.join(path.sep, 'file-structure', 'directory'),
                url: '/directory/'
            });
        });

        it('should order the directories in alphabetic order', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subdirectory1 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-z'), fileStructure);
            let subdirectory2 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-a'), fileStructure);
            let subdirectory3 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-f'), fileStructure);
            let subdirectory4 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-a'), fileStructure);

            expect(directory.toJSON()).to.deep.equal({
                directories: [subdirectory2, subdirectory4, subdirectory3, subdirectory1],
                files: [],
                isDirectory: true,
                name: 'directory',
                path: path.join(path.sep, 'file-structure', 'directory'),
                url: '/directory/'
            });
        });

        it('should order the files in alphabetic order', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file1 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-z'), fileStructure);
            let file2 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-a'), fileStructure);
            let file3 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-f'), fileStructure);
            let file4 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-a'), fileStructure);

            expect(directory.toJSON()).to.deep.equal({
                directories: [],
                files: [file2, file4, file3, file1],
                isDirectory: true,
                name: 'directory',
                path: path.join(path.sep, 'file-structure', 'directory'),
                url: '/directory/'
            });
        });
    });
});
