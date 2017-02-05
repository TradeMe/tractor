/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import path from 'path';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import fs from 'fs';
import Directory from './Directory';
import File from './File';
import * as tractorLogger from 'tractor-logger';

// Under test:
import FileStructure from './FileStructure';

describe('tractor-file-structure - FileStructure:', () => {
    describe('FileStructure constructor:', () => {
        it('should create a new FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(fileStructure).to.be.an.instanceof(FileStructure);
        });

        it('should initalise its interal data structures', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(fileStructure.allFilesByPath).to.deep.equal({ });
            expect(Object.keys(fileStructure.allDirectoriesByPath).length).to.equal(1);
            expect(fileStructure.references).to.deep.equal({ });
        });

        it('should create the root directory', () => {
            sinon.stub(process, 'cwd').returns('');

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(fileStructure.structure).to.be.an.instanceof(Directory);
            expect(fileStructure.structure.path).to.equal(path.join(path.sep, 'file-structure'));

            process.cwd.restore();
        });
    });

    describe('FileStructure.addItem:', () => {
        it('should add a file to the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file'), fileStructure);

            fileStructure.removeItem(file);
            expect(fileStructure.allFilesByPath[path.join(path.sep, 'file-structure', 'directory', 'file')]).to.equal(null);

            fileStructure.addItem(file);

            expect(fileStructure.allFilesByPath[path.join(path.sep, 'file-structure', 'directory', 'file')]).to.equal(file);
        });


        it('should add a directory to the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            fileStructure.removeItem(directory);

            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'directory')]).to.equal(null);

            fileStructure.addItem(directory);

            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'directory')]).to.equal(directory);
        });
    });

    describe('FileStructure.getFiles', () => {
        it('should return all files of a specific type', () => {
            class SomeFile extends File { }
            SomeFile.prototype.extension = '.some.ext';
            SomeFile.prototype.type = 'some-file';
            class SomeOtherFile extends File { }
            SomeOtherFile.prototype.extension = '.other.ext';
            SomeOtherFile.prototype.type = 'some-other-file';
            class FakeOtherFile { }
            FakeOtherFile.prototype.type = 'some-other-file';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file1 = new SomeFile(path.join(path.sep, 'file-structure', 'directory', 'file1.some.ext'), fileStructure);
            let file2 = new SomeFile(path.join(path.sep, 'file-structure', 'directory', 'file2.some.ext'), fileStructure);
            let file3 = new SomeOtherFile(path.join(path.sep, 'file-structure', 'directory', 'other-file.other.ext'), fileStructure);

            let files = fileStructure.getFiles(SomeFile);
            let otherFiles = fileStructure.getFiles(SomeOtherFile);
            let fakeOtherFiles = fileStructure.getFiles(FakeOtherFile);

            expect(files).to.deep.equal([file1, file2]);
            expect(otherFiles).to.deep.equal([file3]);
            expect(fakeOtherFiles).to.deep.equal([file3]);
        });
    });

    describe('FileStructure.read', () => {
        it('should read the entire file structure', () => {
            sinon.stub(Directory.prototype, 'read').returns(Promise.resolve());

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            return fileStructure.read()
            .then(() => {
                expect(Directory.prototype.read).to.have.been.called();
            })
            .finally(() => {
                Directory.prototype.read.restore();
            });
        });
    });

    describe('fileStructure.refresh:', () => {
        it('should reload the File System', () => {
            sinon.stub(Directory.prototype, 'read').returns(Promise.resolve());
            sinon.stub(FileStructure.prototype, 'init');
            sinon.stub(FileStructure.prototype, 'read').returns(Promise.resolve());

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            return fileStructure.refresh()
            .then(() => {
                expect(FileStructure.prototype.init).to.have.been.called();
                expect(FileStructure.prototype.read).to.have.been.called();
            })
            .finally(() => {
                Directory.prototype.read.restore();
                FileStructure.prototype.init.restore();
                FileStructure.prototype.read.restore();
            });
        });
    });

    describe('FileStructure.removeItem:', () => {
        it('should remove a file from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file.extension'), fileStructure);

            expect(fileStructure.allFilesByPath[path.join(path.sep, 'file-structure', 'file.extension')]).to.equal(file);

            fileStructure.removeItem(file);

            expect(fileStructure.allFilesByPath[path.join(path.sep, 'file-structure', 'file.extension')]).to.be.null();
        });

        it('should remove a directory from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'directory')]).to.equal(directory);

            fileStructure.removeItem(directory);

            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'directory')]).to.be.null();
        });
    });

    describe('FileStructure.watch:', () => {
        it('should set up a watcher on the file structure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(tractorLogger, 'info');
            sinon.stub(fs, 'watch');

            fileStructure.watch();

            expect(fs.watch).to.have.been.calledWith(path.join(path.sep, 'file-structure'));

            fs.watch.restore();
            tractorLogger.info.restore();
        });
    });
});
