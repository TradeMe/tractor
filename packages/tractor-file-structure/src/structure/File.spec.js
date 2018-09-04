// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import fs from 'graceful-fs';
import path from 'path';
import { Directory } from './Directory';
import { FileStructure } from './FileStructure';
import { ReferenceManager } from './ReferenceManager';

// Errors:
import { TractorError } from '@tractor/error-handler';

// Promisify:
import { promisifyAll } from 'bluebird';
promisifyAll(fs);

// Under test:
import { File } from './File';

describe('@tractor/file-structure - File:', () => {
    describe('File constructor:', () => {
        it('should create a new File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'file.extension'), fileStructure);

            expect(file).to.be.an.instanceof(File);
        });

        it('should work out the name', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(file.name).to.equal('file.ext');
        });

        it('should get the extension from the file', () => {
            class TestFile extends File { }
            TestFile.prototype.extension = '.test.ext';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.test.ext'), fileStructure);

            expect(file.extension).to.equal('.test.ext');
        });

        it('should fall back to getting the extension from the path', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(file.extension).to.equal('.ext');
        });

        it('should work out the basename from the path and the extension', () => {
            class TestFile extends File { }
            TestFile.prototype.extension = '.test.ext';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.test.ext'), fileStructure);

            expect(file.basename).to.equal('file');
        });

        it('should work out the URL to the file from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(file.url).to.equal('/directory/file.ext');
        });

        it('should correctly replace Windows path seperators in the URL', () => {
            let origPath = { };
            Object.keys(path.win32).forEach(key => {
                origPath[key] = path[key];
                path[key] = path.win32[key];
            });

            sinon.stub(process, 'cwd').returns('');

            let fileStructure = new FileStructure(path.win32.join(path.win32.sep, 'file-structure'));

            let file = new File(path.win32.join(path.win32.sep, 'file-structure', 'directory', 'another-directory', 'file.ext'), fileStructure);

            expect(file.url).to.equal('/directory/another-directory/file.ext');

            process.cwd.restore();

            Object.keys(path.win32).forEach(key => {
                path[key] = origPath[key];
            });
        });

        it('should work out the parent directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(file.directory).to.equal(directory);
        });

        it(`should create the parent directory if it doesn't exist`, () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.ext'), fileStructure);

            expect(file.directory).to.not.be.undefined();
            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'parent-directory')]).to.not.be.undefined();
            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'parent-directory', 'directory')]).to.not.be.undefined();
        });

        it('should throw an error if the File path is outside the root of the FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(() => {
                new File(path.join(path.sep, 'outside', 'file.ext'), fileStructure);
            }).to.throw(TractorError, `Cannot create "${path.join(path.sep, 'outside', 'file.ext')}" because it is outside of the root of the FileStructure`);
        });

        it('should throw an error if the File path is outside the root of the FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(() => {
                new File(path.join(path.sep, 'outside', 'file.ext'), fileStructure);
            }).to.throw(TractorError, `Cannot create "${path.join(path.sep, 'outside', 'file.ext')}" because it is outside of the root of the FileStructure`);
        });

        it('should be added to its directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'addItem');

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(directory.addItem).to.have.been.calledWith(file);
        });
    });

    describe('File.addReference', () => {
        it('should add a reference from one file to the other', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file.ext'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other file.ext'), fileStructure);

            file.addReference(otherFile);

            expect(file.references).to.deep.equal([otherFile]);
            expect(otherFile.referencedBy).to.deep.equal([file]);
        });
    });

    describe('File.cleanup:', () => {
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
            let file = new File(path.join(path.sep, 'file-structure', 'file.ext'), fileStructure);

            sinon.stub(file, 'delete').resolves();
            sinon.stub(file.directory, 'cleanup').resolves();

            await file.cleanup();

            expect(file.directory.cleanup).to.have.been.called();
        });

        it('should stop once it gets to a directory that is not empty', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            let file1 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-1.ext'), fileStructure);
            let file2 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-2.ext'), fileStructure);

            sinon.stub(fs, 'unlinkAsync').resolves();
            sinon.spy(directory, 'delete');
            sinon.spy(file1, 'delete');
            sinon.spy(file2, 'delete');

            await file1.cleanup();

            expect(file1.delete).to.have.been.called();
            expect(fs.unlinkAsync).to.have.been.calledOnce();
            expect(directory.delete).to.have.been.called();
            expect(file2.delete).to.not.have.been.called();

            fs.unlinkAsync.restore();
        });
    });

    describe('File.clearReferences', () => {
        it('should clear all references to and from a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file.ext'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file.ext'), fileStructure);

            file.addReference(otherFile);

            expect(file.references).to.deep.equal([otherFile]);
            expect(otherFile.referencedBy).to.deep.equal([file]);

            file.clearReferences();

            expect(file.references).to.deep.equal([]);
            expect(otherFile.referencedBy).to.deep.equal([]);
        });
    });

    describe('File.delete:', () => {
        it('should delete the file', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'unlinkAsync').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.delete();

            expect(fs.unlinkAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'file.ext'));

            fs.unlinkAsync.restore();
        });

        it(`should remove the file from it's directory`, async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'removeItem');
            sinon.stub(fs, 'unlinkAsync').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.delete();

            expect(directory.removeItem).to.have.been.calledOnce();

            fs.unlinkAsync.restore();
        });

        it(`shouldn't remove the file if it's referenced by another file`, async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'removeItem');
            sinon.stub(fs, 'unlinkAsync').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'), fileStructure);
            otherFile.addReference(file);

            try {
                await file.delete();
            } catch (error) {
                expect(error).to.deep.equal(new TractorError(`Cannot delete ${path.join(path.sep, 'file-structure', 'directory', 'file.ext')} as it is referenced by another file.`));
            }

            expect(directory.removeItem).to.not.have.been.called();

            fs.unlinkAsync.restore();
        });

        it(`should remove the file if it's being moved`, async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'removeItem');
            sinon.stub(fs, 'unlinkAsync').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.delete({ isMove: true });

            expect(directory.removeItem).to.have.been.called();

            fs.unlinkAsync.restore();
        });
    });

    describe('File.move:', () => {
        it('should move a file', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(File.prototype, 'save').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
            });

            expect(File.prototype.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'other-directory', 'file.ext'), fileStructure);
            expect(File.prototype.save).to.have.been.called();
            expect(File.prototype.delete).to.have.been.called();

            File.prototype.constructor.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
        });

        it('should pass the options through to the `save` and `delete` calls', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(File.prototype, 'save').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let buffer = new Buffer('data');
            file.buffer = buffer;

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
            });

            expect(File.prototype.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'other-directory', 'file.ext'), fileStructure);
            expect(File.prototype.save).to.have.been.calledWith(buffer, { isMove: true });
            expect(File.prototype.delete).to.have.been.calledWith({ isMove: true });

            File.prototype.constructor.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
        });

        it('should copy a file', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'save').resolves();
            sinon.stub(File.prototype, 'delete').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
            }, {
                isCopy: true
            });

            expect(File.prototype.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'other-directory', 'file.ext'), fileStructure);
            expect(File.prototype.save).to.have.been.called();
            expect(File.prototype.delete).to.not.have.been.called();

            File.prototype.constructor.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
        });

        it('should clear all the references', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'clearReferences');
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(File.prototype, 'save').resolves();

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
            });

            expect(file.clearReferences).to.have.been.called();

            File.prototype.constructor.restore();
            File.prototype.clearReferences.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
        });

        it('should add the reference back', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let reference = new File(path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'), fileStructure);

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'save').resolves();
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(ReferenceManager.prototype, 'getReferencedBy').returns([reference]);
            sinon.stub(reference, 'addReference');
            sinon.stub(reference, 'refactor').resolves();

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
            });

            expect(reference.addReference).to.have.been.called();

            File.prototype.constructor.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
            ReferenceManager.prototype.getReferencedBy.restore();
        });

        it(`shouldn't clear all the references if it is a copy`, async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'clearReferences');
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(File.prototype, 'save').resolves();

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
            }, {
                isCopy: true
            });

            expect(file.clearReferences).to.not.have.been.called();

            File.prototype.constructor.restore();
            File.prototype.clearReferences.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
        });

        it('should call `refactor` on any files that it is reference by', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let reference = new File(path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'), fileStructure);

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'save').resolves();
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(ReferenceManager.prototype, 'getReferencedBy').returns([reference]);
            sinon.stub(reference, 'refactor').resolves();

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
            });

            expect(reference.refactor).to.have.been.calledWith('referenceNameChange', {
                oldName: 'file',
                newName: 'renamed',
                extension: '.ext'
            });
            expect(reference.refactor).to.have.been.calledWith('referencePathChange', {
                fromPath: path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'),
                oldToPath: path.join(path.sep, 'file-structure', 'directory', 'file.ext'),
                newToPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
            });

            File.prototype.constructor.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
            ReferenceManager.prototype.getReferencedBy.restore();
        });

        it('should call `refactor` on the new file', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(File.prototype, 'refactor').resolves();
            sinon.stub(File.prototype, 'save').resolves();

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
            });

            expect(File.prototype.refactor).to.have.been.calledWith('fileNameChange', {
                oldName: 'file',
                newName: 'renamed'
            });

            File.prototype.constructor.restore();
            File.prototype.delete.restore();
            File.prototype.refactor.restore();
            File.prototype.save.restore();
        });

        it('should call `refactor` on any files that it is reference by', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let reference = new File(path.join(path.sep, 'file-structure', 'directory', 'other-file.ref'), fileStructure);

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'save').resolves();
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(ReferenceManager.prototype, 'getReferencedBy').returns([reference]);
            sinon.stub(reference, 'refactor').resolves();

            await file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
            });

            expect(reference.refactor).to.have.been.calledWith('referenceNameChange', {
                oldName: 'file',
                newName: 'renamed',
                extension: '.ref'
            });
            expect(reference.refactor).to.have.been.calledWith('referencePathChange', {
                fromPath: path.join(path.sep, 'file-structure', 'directory', 'other-file.ref'),
                oldToPath: path.join(path.sep, 'file-structure', 'directory', 'file.ext'),
                newToPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
            });

            File.prototype.constructor.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
            ReferenceManager.prototype.getReferencedBy.restore();
        });

        it(`should throw an error if it can't refactor the reference`, async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let reference = new File(path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'), fileStructure);

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'save').resolves();
            sinon.stub(File.prototype, 'delete').resolves();
            sinon.stub(ReferenceManager.prototype, 'getReferencedBy').returns([reference]);
            sinon.stub(reference, 'refactor').rejects();

            try {
                await file.move({
                    newPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
                });

                expect(reference.refactor).to.have.been.calledWith('referenceNameChange', {
                    oldName: 'file',
                    newName: 'renamed',
                    extension: '.ext'
                });
                expect(reference.refactor).to.have.been.calledWith('referencePathChange', {
                    fromPath: path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'),
                    oldToPath: path.join(path.sep, 'file-structure', 'directory', 'file.ext'),
                    newToPath: path.join(path.sep, 'file-structure', 'other-directory', 'renamed.ext')
                });
            } catch (error) {
                expect(error).to.deep.equal(new TractorError(`Could not update references after moving ${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}.`));
            }

            File.prototype.constructor.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
            ReferenceManager.prototype.getReferencedBy.restore();
        });
    });

    describe('File.read:', () => {
        it('should read the file', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'readFileAsync').resolves(new Buffer('content'));

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.read();

            expect(fs.readFileAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'file.ext'));
            expect(file.content).to.equal('content');
            expect(file.buffer.equals(new Buffer('content'))).to.equal(true);

            fs.readFileAsync.restore();
        });
    });

    describe('File.refactor:', () => {
        it('should do nothing by default', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            // eslint-disable-next-line
            console.log(Promise);
            sinon.spy(Promise, 'resolve');

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.refactor();

            expect(Promise.resolve).to.have.been.called();

            Promise.resolve.restore();
        });
    });

    describe('File.save:', () => {
        it('should save the file', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'mkdirAsync').resolves();
            sinon.stub(fs, 'writeFileAsync').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.save('content');

            expect(fs.writeFileAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), 'content');
            expect(file.content).to.equal('content');
            expect(file.buffer.equals(new Buffer('content'))).to.equal(true);

            fs.mkdirAsync.restore();
            fs.writeFileAsync.restore();
        });

        it('should make sure the parent directory is saved', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(Directory.prototype, 'save').resolves();
            sinon.stub(fs, 'writeFileAsync').resolves();

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            await file.save('content');

            expect(Directory.prototype.save).to.have.been.called();

            Directory.prototype.save.restore();
            fs.writeFileAsync.restore();
        });
    });

    describe('File.serialise:', () => {
        it('should call `File.prototype.toJSON`', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            let serialised = file.serialise();

            expect(serialised).to.deep.equal({
                basename: 'file',
                extension: '.ext',
                path: path.join(path.sep, 'file-structure', 'directory', 'file.ext'),
                references: [],
                referencedBy: [],
                url: '/directory/file.ext'
            });
        });
    });

    describe('File.toJSON:', () => {
        it('should return specific properties of the object', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            let json = file.toJSON();

            expect(json).to.deep.equal({
                basename: 'file',
                extension: '.ext',
                path: path.join(path.sep, 'file-structure', 'directory', 'file.ext'),
                references: [],
                referencedBy: [],
                url: '/directory/file.ext'
            });
        });

        it('should contain the files that the file references', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'), fileStructure);

            file.addReference(otherFile);

            let json = file.toJSON();

            expect(json.references).to.deep.equal([{
                basename: 'other-file',
                extension: '.ext',
                path: path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'),
                url: '/directory/other-file.ext'
            }]);
        });

        it('should contain the files that reference the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'), fileStructure);

            otherFile.addReference(file);

            let json = file.toJSON();

            expect(json.referencedBy).to.deep.equal([{
                basename: 'other-file',
                extension: '.ext',
                path: path.join(path.sep, 'file-structure', 'directory', 'other-file.ext'),
                url: '/directory/other-file.ext'
            }]);
        });
    });
});
