// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import path from 'path';
import { Directory } from './Directory';
import { File } from './File';
import { ReferenceManager } from './ReferenceManager';
import * as tractorLogger from '@tractor/logger';

// Under test:
import { FileStructure } from './FileStructure';

describe('@tractor/file-structure - FileStructure:', () => {
    describe('FileStructure constructor:', () => {
        it('should create a new FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(fileStructure).to.be.an.instanceof(FileStructure);
        });

        it('should initalise its interal data structures', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(fileStructure.allFilesByPath).to.deep.equal({ });
            expect(Object.keys(fileStructure.allDirectoriesByPath).length).to.equal(1);
        });

        it('should create the root directory', () => {
            sinon.stub(process, 'cwd').returns('');

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(fileStructure.structure).to.be.an.instanceof(Directory);
            expect(fileStructure.structure.path).to.equal(path.join(path.sep, 'file-structure'));

            process.cwd.restore();
        });

        it('should create the references manager', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(fileStructure.referenceManager).to.be.an.instanceof(ReferenceManager);
        });
    });

    describe('FileStructure.addFileType', () => {
        it('should add a type of file that the FileStructure can create', () => {
            class TestFile extends File {
                save () { }
            }
            TestFile.prototype.extension = '.ext';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            fileStructure.addFileType(TestFile);

            expect(fileStructure.fileTypes['.ext']).to.equal(TestFile);
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

    describe('FileStructure.read', () => {
        it('should read the entire file structure', async () => {
            sinon.stub(Directory.prototype, 'read').resolves();

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            await fileStructure.read();
            expect(Directory.prototype.read).to.have.been.called();

            Directory.prototype.read.restore();
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
            sinon.stub(chokidar, 'watch').returns(new EventEmitter());

            fileStructure.watch();

            expect(chokidar.watch).to.have.been.calledWith(path.join(path.sep, 'file-structure'));

            chokidar.watch.restore();
            tractorLogger.info.restore();
        });

        it('should refresh the FileStructure when a file within it changes', done => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file.extension'), fileStructure);
            let eventEmitter = new EventEmitter();

            sinon.stub(fileStructure.structure, 'refresh').resolves();
            sinon.stub(tractorLogger, 'info');
            sinon.stub(chokidar, 'watch').returns(eventEmitter);

            let watcher = fileStructure.watch();

            eventEmitter.emit('all', null, file.path);

            watcher.on('change', () => {
                expect(fileStructure.structure.refresh).to.have.been.called();

                chokidar.watch.restore();
                tractorLogger.info.restore();

                done();
            });
        });

        it('should refresh the FileStructure when the root changes', done => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let eventEmitter = new EventEmitter();

            sinon.stub(fileStructure.structure, 'refresh').resolves();
            sinon.stub(tractorLogger, 'info');
            sinon.stub(chokidar, 'watch').returns(eventEmitter);

            let watcher = fileStructure.watch();

            eventEmitter.emit('all', null, fileStructure.path);

            watcher.on('change', () => {
                expect(fileStructure.structure.refresh).to.have.been.called();

                chokidar.watch.restore();
                tractorLogger.info.restore();

                done();
            });
        });
    });
});
