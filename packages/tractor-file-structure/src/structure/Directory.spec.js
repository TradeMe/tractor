// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import fs from 'graceful-fs';
import path from 'path';
import { File } from './File';
import { FileStructure } from './FileStructure';

// Errors:
import { TractorError } from '@tractor/error-handler';

// Promisify:
import { promisifyAll } from 'bluebird';
promisifyAll(fs);

// Under test:
import { Directory } from './Directory';

describe('@tractor/file-structure - Directory:', () => {
    describe('Directory constructor:', () => {
        it('should create a new Directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            expect(directory).to.be.an.instanceof(Directory);
        });

        it('should work out the directory name', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            expect(directory.name).to.equal('directory');
        });

        it('should work out the directory basename', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            expect(directory.basename).to.equal('directory');
        });

        it('should work out the URL to the directory from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            expect(directory.url).to.equal('/directory');
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
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            directory.addItem(file);

            expect(directory.files.length).to.equal(1);
            let [expectedFile] = directory.files;
            expect(expectedFile).to.equal(file);
        });

        it('should not add the file if it has already been added', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            directory.addItem(file);
            directory.addItem(file);

            expect(directory.files.length).to.equal(1);
        });

        it('should add the file to the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fileStructure, 'addItem');

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
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
        it('should delete the directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'delete').resolves();
            sinon.stub(directory.directory, 'cleanup').resolves();

            await directory.cleanup();

            expect(directory.delete).to.have.been.called();
        });

        it('should cleanup the parent directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'delete').resolves();
            sinon.stub(directory.directory, 'cleanup').resolves();

            await directory.cleanup();

            expect(directory.directory.cleanup).to.have.been.called();
        });

        it('should stop once it gets to the root of the FileStructure', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.spy(directory, 'delete');
            sinon.spy(directory.directory, 'delete');

            await directory.cleanup();

            expect(directory.delete).to.have.been.called();
            expect(directory.directory.delete).to.have.been.called();

            fs.rmdirAsync.restore();
        });

        it('should stop once it gets to a directory that is not empty', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.spy(directory, 'delete');
            sinon.spy(file, 'delete');
            sinon.spy(subdirectory, 'delete');

            await subdirectory.cleanup();

            expect(fs.rmdirAsync).to.have.been.calledOnce();
            expect(subdirectory.delete).to.have.been.called();
            expect(directory.delete).to.have.been.called();
            expect(file.delete).to.not.have.been.called();

            fs.rmdirAsync.restore();
        });

        it('should rethrow if something unexpected goes wrong', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            let unexpectedError = new Error('Unexpected error');
            sinon.stub(fs, 'rmdirAsync').rejects(unexpectedError);

            try {
                await directory.cleanup();
            } catch (error) {
                expect(error).to.equal(unexpectedError);
            }

            fs.rmdirAsync.restore();
        });
    });

    describe('Directory.delete:', () => {
        it('should delete the directory if it is empty', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').resolves();

            await directory.delete();

            expect(fs.rmdirAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory'));

            fs.rmdirAsync.restore();
        });

        it('should remove itself from its parent directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.stub(fileStructure.structure, 'removeItem');

            await directory.delete();

            expect(fileStructure.structure.removeItem).to.have.been.calledWith(directory);

            fs.rmdirAsync.restore();
        });

        it('should remove itself from the FileStructure if it is the root directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.stub(fileStructure, 'removeItem');

            await fileStructure.structure.delete();

            expect(fileStructure.removeItem).to.have.been.calledWith(fileStructure.structure);

            fs.rmdirAsync.restore();
        });

        it('should throw if the directory is not empty', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.spy(file, 'delete');
            sinon.spy(subdirectory, 'delete');

            try {
                await directory.delete();
            } catch (error) {
                expect(error).to.deep.equal(new TractorError(`Cannot delete "${directory.path}" because it is not empty`));
                expect(subdirectory.delete).to.not.have.been.called();
                expect(file.delete).to.not.have.been.called();
            }

            fs.rmdirAsync.restore();
        });
    });

    describe('Directory.move:', () => {
        it('should move a directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(Directory.prototype, 'constructor');
            sinon.stub(Directory.prototype, 'delete').resolves();
            sinon.stub(Directory.prototype, 'save').resolves();

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            await directory.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory')
            });

            expect(Directory.prototype.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'other-directory'), fileStructure);
            expect(Directory.prototype.save).to.have.been.called();
            expect(Directory.prototype.delete).to.have.been.called();

            Directory.prototype.constructor.restore();
            Directory.prototype.delete.restore();
            Directory.prototype.save.restore();
        });

        it('should copy a directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(Directory.prototype, 'constructor');
            sinon.stub(Directory.prototype, 'delete').resolves();
            sinon.stub(Directory.prototype, 'save').resolves();

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            await directory.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory')
            }, {
                isCopy: true
            });

            expect(Directory.prototype.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'other-directory'), fileStructure);
            expect(Directory.prototype.save).to.have.been.called();
            expect(Directory.prototype.delete).to.not.have.been.called();

            Directory.prototype.constructor.restore();
            Directory.prototype.delete.restore();
            Directory.prototype.save.restore();
        });

        it('should move all the children items', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(Directory.prototype, 'delete').resolves();
            sinon.stub(Directory.prototype, 'save').resolves();

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subDirectory1 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-1'), fileStructure);
            let subDirectory2 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-2'), fileStructure);

            sinon.stub(subDirectory1, 'move').resolves();
            sinon.stub(subDirectory2, 'move').resolves();

            await directory.move({
              newPath: path.join(path.sep, 'file-structure', 'other-directory')
            });

            expect(subDirectory1.move).to.have.been.calledWith({ newPath: path.join(path.sep, 'file-structure', 'other-directory', 'sub-directory-1') });
            expect(subDirectory2.move).to.have.been.calledWith({ newPath: path.join(path.sep, 'file-structure', 'other-directory', 'sub-directory-2') });

            Directory.prototype.delete.restore();
            Directory.prototype.save.restore();
        });
    });

    describe('Directory.read:', () => {
        it('should read the directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'readdirAsync').resolves([]);

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            await directory.read();

            expect(fs.readdirAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));

            fs.readdirAsync.restore();
        });

        it('should should not read the directory while it is already being read', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'readdirAsync').resolves([]);

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            directory.read();
            await directory.read();

            expect(fs.readdirAsync).to.have.been.calledOnce();

            fs.readdirAsync.restore();
        });

        it('should read any directories contained within the Directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stat = {
                isDirectory: () => { }
            };

            sinon.spy(Directory.prototype, 'read');
            let readdirAsync = sinon.stub(fs, 'readdirAsync');
            readdirAsync.onCall(0).resolves(['directory']);
            readdirAsync.onCall(1).resolves([]);
            sinon.stub(fs, 'statAsync').resolves(stat);
            sinon.stub(stat, 'isDirectory').returns(true);

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            await directory.read();

            expect(fs.statAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));
            expect(Directory.prototype.read).to.have.been.calledTwice();

            Directory.prototype.read.restore();
            fs.readdirAsync.restore();
            fs.statAsync.restore();
        });

        it('should create a rich model for files of a known type', async () => {
            class TestFile extends File { }
            TestFile.prototype.extension = '.ext';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            fileStructure.addFileType(TestFile);
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);
            let stat = {
                isDirectory: () => { }
            };

            sinon.stub(File.prototype, 'read');
            sinon.stub(fs, 'readdirAsync').resolves(['file.ext']);
            sinon.stub(fs, 'statAsync').resolves(stat);
            sinon.stub(stat, 'isDirectory').returns(false);

            await directory.read();

            expect(fs.statAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.ext'));
            let [file] = directory.files;
            expect(file instanceof TestFile).to.equal(true);

            File.prototype.read.restore();
            fs.readdirAsync.restore();
            fs.statAsync.restore();
        });

        it('should create a rich model for files of a known type with multiple extensions', async () => {
            class SpecialTestFile extends File { }
            SpecialTestFile.prototype.extension = '.special.ext';

            sinon.stub(SpecialTestFile.prototype, 'save').resolves();

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            fileStructure.addFileType(SpecialTestFile);
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);
            let stat = {
                isDirectory: () => { }
            };

            sinon.stub(File.prototype, 'read');
            sinon.stub(fs, 'readdirAsync').resolves(['file.special.ext']);
            sinon.stub(fs, 'statAsync').resolves(stat);
            sinon.stub(stat, 'isDirectory').returns(false);

            await directory.read();

            expect(fs.statAsync).to.have.been.called.with(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.special.ext'));
            let [file] = directory.files;
            expect(file instanceof SpecialTestFile).to.equal(true);

            File.prototype.read.restore();
            fs.readdirAsync.restore();
            fs.statAsync.restore();
        });

        it('should not create a model for any files of an unknown type', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stat = {
                isDirectory: () => { }
            };

            sinon.stub(fs, 'readdirAsync').resolves(['file.ext']);
            sinon.stub(fs, 'statAsync').resolves(stat);
            sinon.stub(stat, 'isDirectory').returns(false);

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            await directory.read();

            expect(fs.statAsync).to.not.have.been.called();
            expect(directory.files.length).to.equal(0);

            fs.readdirAsync.restore();
            fs.statAsync.restore();
        });
    });

    describe('Directory.removeItem:', () => {
        it('should remove a file from the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            directory.removeItem(file);

            expect(directory.files.length).to.equal(0);
        });

        it('should remove the file from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fileStructure, 'removeItem');

            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
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
        it('should delete the directory', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'rmdirAsync').resolves();

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            await directory.rimraf();

            expect(fs.rmdirAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));

            fs.rmdirAsync.restore();
        });

        it('should remove itself from its parent', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let parent = new Directory(path.join(path.sep, 'file-structure', 'parent-directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.stub(parent, 'removeItem');

            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            await directory.rimraf();

            expect(parent.removeItem).to.have.been.calledWith(directory);

            fs.rmdirAsync.restore();
        });

        it('should remove itself from the FileStructure if it is the root direction', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.stub(fileStructure, 'removeItem');

            await fileStructure.structure.rimraf();

            expect(fileStructure.removeItem).to.have.been.calledWith(fileStructure.structure);

            fs.rmdirAsync.restore();
        });

        it('should delete all its sub-directories', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'sub-directory'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.stub(subdirectory, 'rimraf');

            await directory.rimraf();

            expect(subdirectory.rimraf).to.have.been.called();

            fs.rmdirAsync.restore();
        });

        it('should delete all its files', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.ext'), fileStructure);

            sinon.stub(fs, 'rmdirAsync').resolves();
            sinon.stub(file, 'delete');

            await directory.rimraf();

            expect(file.delete).to.have.been.called();

            fs.rmdirAsync.restore();
        });
    });

    describe('Directory.save:', () => {
        it('should should do nothing if the directory already exists', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            sinon.stub(fs, 'statAsync').resolves();
            sinon.spy(fs, 'mkdirAsync');

            await directory.save();

            expect(fs.statAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));
            expect(fs.mkdirAsync).to.not.have.been.called();

            fs.statAsync.restore();
            fs.mkdirAsync.restore();
        });

        it(`should save the directory if it doesn't exist yet`, async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'), fileStructure);

            sinon.stub(fs, 'statAsync').rejects();
            sinon.stub(fs, 'mkdirAsync').resolves();

            await directory.save();

            expect(fs.mkdirAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'parent-directory', 'directory'));

            fs.mkdirAsync.restore();
        });
    });

    describe('Directory.toJSON:', () => {
        it('should return important properties of the directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(directory.toJSON()).to.deep.equal({
                basename: 'directory',
                directories: [subdirectory.serialise()],
                files: [file.serialise()],
                isDirectory: true,
                path: path.join(path.sep, 'file-structure', 'directory'),
                url: '/directory'
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
                basename: 'directory',
                directories: [subdirectory2.serialise(), subdirectory4.serialise(), subdirectory3.serialise(), subdirectory1.serialise()],
                files: [],
                isDirectory: true,
                path: path.join(path.sep, 'file-structure', 'directory'),
                url: '/directory'
            });
        });

        it('should order the files in alphabetic order', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file1 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-z.ext'), fileStructure);
            let file2 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-a.ext'), fileStructure);
            let file3 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-f.ext'), fileStructure);
            let file4 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-a.ext'), fileStructure);

            expect(directory.toJSON()).to.deep.equal({
                basename: 'directory',
                directories: [],
                files: [file2.serialise(), file4.serialise(), file3.serialise(), file1.serialise()],
                isDirectory: true,
                path: path.join(path.sep, 'file-structure', 'directory'),
                url: '/directory'
            });
        });
    });
});
