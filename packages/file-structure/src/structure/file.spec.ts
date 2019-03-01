// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import * as fs from 'graceful-fs';
import * as path from 'path';
import { promisify } from 'util';
import { Directory } from './directory';
import { FileStructure } from './file-structure';

// Errors:
import { TractorError } from '@tractor/error-handler';

// Under test:
import { File } from './file';

describe('@tractor/file-structure - File:', () => {
    describe('File constructor:', () => {
        it('should create a new File', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            expect(file).to.be.an.instanceof(File);
        });

        it('should work out the name', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            expect(file.name).to.equal('file.ext');
        });

        it('should get the extension from the file', () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File { }
            TestFile.prototype.extension = '.test.ext';

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            const file = new TestFile(path.join(fileStructure.path, 'file.test.ext'), fileStructure);

            expect(file.extension).to.equal('.test.ext');
        });

        it('should fall back to getting the extension from the path', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            expect(file.extension).to.equal('.ext');
        });

        it('should work out the basename from the path and the extension', () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File { }
            TestFile.prototype.extension = '.test.ext';

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            const file = new TestFile(path.join(fileStructure.path, 'file.test.ext'), fileStructure);

            expect(file.basename).to.equal('file');
        });

        it('should work out the URL to the file from the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            expect(file.url).to.equal('/file.ext');
        });

        it('should correctly replace Windows path seperators in the URL', () => {
            type Path = typeof path;
            type PathWin32 = typeof path.win32;
            type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };
            const origPath: Partial<Writeable<Path>> = {};

            // HACK:
            // Force using the win32 versions of `path` methods:
            Object.keys(path.win32).forEach(key => {
                const pathKey = key as keyof Path;
                const pathKeyWin = key as keyof PathWin32;
                origPath[pathKey] = path[pathKey];
                (path as Writeable<PathWin32>)[pathKeyWin] = path.win32[pathKeyWin];
            });

            const fileStructure = new FileStructure(path.win32.resolve(__dirname, '../../fixtures/file'));

            const file = new File(path.win32.join(fileStructure.path, 'file.ext'), fileStructure);

            expect(file.url).to.equal('/file.ext');

            // HACK:
            // Restore original versions of `path` methods:
            Object.keys(path.win32).forEach(key => {
                const pathKey = key as keyof Path;
                (path as Writeable<Path>)[pathKey] = origPath[pathKey] as Writeable<Path>;
            });
        });

        it('should work out the parent directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'file'), fileStructure);

            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            expect(file.directory).to.equal(directory);
        });

        it(`should create the parent directory if it doesn't exist`, () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            const file = new File(path.join(fileStructure.path, 'directory', 'directory', 'file.ext'), fileStructure);

            expect(file.directory).to.not.equal(undefined);
            expect(fileStructure.allDirectoriesByPath[path.join(fileStructure.path, 'directory')]).to.not.equal(undefined);
            expect(fileStructure.allDirectoriesByPath[path.join(fileStructure.path, 'directory', 'directory')]).to.not.equal(undefined);
        });

        it('should throw an error if the File path is outside the root of the FileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            expect(() => new File(path.join(path.sep, 'file.ext'), fileStructure))
            .to.throw(TractorError, `Cannot create "${path.join(path.sep, 'file.ext')}" because it is outside of the root of the FileStructure`);
        });

        it('should throw an error if a File has already been created for that path', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));

            // tslint:disable-next-line:no-unused-expression
            new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            expect(() => new File(path.join(fileStructure.path, 'file.ext'), fileStructure))
            .to.throw(TractorError, `Cannot create "${path.join(fileStructure.path, 'file.ext')}" because it already exists`);
        });

        it('should be added to its directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'file'), fileStructure);

            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            expect(directory.files.includes(file)).to.equal(true);
            expect(directory.allFiles.includes(file)).to.equal(true);
        });
    });

    describe('File.addReference', () => {
        it('should add a reference from one file to the other', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
            const otherFile = new File(path.join(fileStructure.path, 'other file.ext'), fileStructure);

            file.addReference(otherFile);

            expect(file.references).to.deep.equal([otherFile]);
            expect(otherFile.referencedBy).to.deep.equal([file]);
        });
    });

    describe('File.cleanup:', () => {
        it('should delete the file', async () => {
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-cleanup'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
            await file.save('');

            await file.cleanup();

            try {
                await readFile(file.path);
                expect(true).to.equal('`readFile` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }
        });

        it('should cleanup the parent directory', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-cleanup-parent'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
            await file.save('');

            await file.save('');

            await file.cleanup();

            try {
                await readdir(directory.path);
                expect(true).to.equal('`readdir` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }
        });

        it('should stop once it gets to a directory that is not empty', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-cleanup-stop'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file1 = new File(path.join(directory.path, 'file-1.ext'), fileStructure);
            const file2 = new File(path.join(directory.path, 'file-2.ext'), fileStructure);

            await Promise.all([file1.save(''), file2.save('')]);
            await file1.cleanup();

            const files = await readdir(directory.path);

            expect(files).to.deep.equal(['file-2.ext']);

            await Promise.all([file2.cleanup()]);
        });
    });

    describe('File.clearReferences', () => {
        it('should clear all references to and from a file', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
            const otherFile = new File(path.join(fileStructure.path, 'other-file.ext'), fileStructure);

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
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-delete'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
            await file.save('');

            await file.delete();

            try {
                await readFile(file.path);
                expect(true).to.equal('`readFile` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }

            await directory.cleanup();
        });

        it(`should remove the file from it's directory`, async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-delete-from-directory'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
            await file.save('');

            await file.delete();

            expect(directory.files.includes(file)).to.equal(false);

            await directory.cleanup();
        });

        it(`shouldn't remove the file if it's referenced by another file`, async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-delete-throw-when-referenced'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
            const otherFile = new File(path.join(directory.path, 'other-file.ext'), fileStructure);
            otherFile.addReference(file);

            try {
                await file.delete();
            } catch (error) {
                expect(error).to.deep.equal(new TractorError(`Cannot delete "${path.join(directory.path, 'file.ext')}" as it is referenced by another file.`));
            }

            expect(directory.files.includes(file)).to.equal(true);

            await directory.cleanup();
        });

        it(`should remove the file if it's being moved`, async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-delete-moved'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
            const otherFile = new File(path.join(directory.path, 'other-file.ext'), fileStructure);
            otherFile.addReference(file);
            await file.save('');

            await file.delete({ isMove: true });

            expect(directory.files.includes(file)).to.equal(false);

            await otherFile.save('');
            await otherFile.cleanup();
        });

        it(`should throw an error if it can't delete the file`, async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-delete-error'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            try {
                await file.delete();
            } catch (e) {
                expect(e).to.deep.equal(new TractorError(`Cannot delete "${path.join(directory.path, 'file.ext')}". Something went wrong.`));
            }

            await directory.cleanup();
        });
    });

    describe('File.move:', () => {
        it('should move a file', async () => {
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-move-file'));
            const originalPath = path.join(fileStructure.path, 'directory', 'file.ext');
            const movedPath = path.join(fileStructure.path, 'other-directory', 'file.ext');
            const file = new File(originalPath, fileStructure);
            await file.save('🚜');

            await file.move({
                newPath: movedPath
            });

            try {
                await readFile(originalPath);
                expect(true).to.equal('`readFile` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }

            try {
                const contents = await readFile(movedPath);
                expect(contents.toString()).to.equal('🚜');
            } catch (e) {
                expect(true).to.equal('`readFile` should not throw');
            }

            await file.directory.cleanup();
            await fileStructure.allFilesByPath[movedPath]!.cleanup();
        });

        it('should copy a file', async () => {
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-copy-file'));
            const originalPath = path.join(fileStructure.path, 'directory', 'file.ext');
            const movedPath = path.join(fileStructure.path, 'other-directory', 'file.ext');
            const file = new File(originalPath, fileStructure);
            await file.save('🚜');

            await file.move({
                newPath: movedPath
            }, {
                isCopy: true
            });

            try {
                const contents = await readFile(originalPath);
                expect(contents.toString()).to.equal('🚜');
            } catch (e) {
                expect(true).to.equal('`readFile` should not throw');
            }

            try {
                const contents = await readFile(movedPath);
                expect(contents.toString()).to.equal('🚜');
            } catch (e) {
                expect(true).to.equal('`readFile` should not throw');
            }

            await fileStructure.allFilesByPath[originalPath]!.cleanup();
            await fileStructure.allFilesByPath[movedPath]!.cleanup();
        });

        it('should clear all the references', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-move-clear-references'));
            const originalPath = path.join(fileStructure.path, 'directory', 'file.ext');
            const movedPath = path.join(fileStructure.path, 'other-directory', 'file.ext');
            const file = new File(originalPath, fileStructure);
            const otherFile = new File(path.join(fileStructure.path, 'directory', 'other-file.ext'), fileStructure);
            await file.save('🚜');
            await otherFile.save('🚜');
            file.addReference(otherFile);

            await file.move({
                newPath: movedPath
            });

            expect(file.references).to.deep.equal([]);

            await fileStructure.allFilesByPath[movedPath]!.cleanup();
            await otherFile.cleanup();
        });

        it('should add the reference back', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-move-add-reference'));
            const originalPath = path.join(fileStructure.path, 'file.ext');
            const movedPath = path.join(fileStructure.path, 'renamed.ext');
            const file = new File(originalPath, fileStructure);
            const otherFile = new File(path.join(fileStructure.path, 'other-file.ext'), fileStructure);
            await file.save('🚜');
            await otherFile.save('🚜');
            file.addReference(otherFile);

            await file.move({
                newPath: movedPath
            });

            const newFile = fileStructure.allFilesByPath[movedPath]!;
            expect(newFile.references).to.deep.equal([otherFile]);

            await newFile.cleanup();
            await otherFile.cleanup();
        });

        it(`shouldn't clear all the references if it is a copy`, async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-move-references-copy'));
            const originalPath = path.join(fileStructure.path, 'file.ext');
            const movedPath = path.join(fileStructure.path, 'renamed.ext');
            const file = new File(originalPath, fileStructure);
            const otherFile = new File(path.join(fileStructure.path, 'other-file.ext'), fileStructure);
            await file.save('🚜');
            await otherFile.save('🚜');
            file.addReference(otherFile);

            await file.move({
                newPath: movedPath
            }, {
                isCopy: true
            });

            expect(file.references).to.deep.equal([otherFile]);

            await file.cleanup();
            await otherFile.cleanup();
            await fileStructure.allFilesByPath[movedPath]!.cleanup();
        });

        it('should call `refactor` on any files that it is referenced by', async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File {
                public async refactor (): Promise<void> {
                    await this.save('🔥');
                }
            }

            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-move-refactor-referenced'));
            const otherFilePath = path.join(fileStructure.path, 'other-file.ext');
            const movedPath = path.join(fileStructure.path, 'renamed.ext');
            const file = new TestFile(path.join(fileStructure.path, 'file.ext'), fileStructure);
            const otherFile = new TestFile(otherFilePath, fileStructure);
            await file.save('🚜');
            await otherFile.save('🚜');
            otherFile.addReference(file);

            await file.move({
                newPath: movedPath
            });

            try {
                const contents = await readFile(otherFilePath);
                expect(contents.toString()).to.equal('🔥');
            } catch (e) {
                expect(true).to.equal('`readFile` should not throw');
            }

            await otherFile.cleanup();
            await fileStructure.allFilesByPath[movedPath]!.cleanup();
        });

        it('should call `refactor` on the new file', async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File {
                public async refactor (): Promise<void> {
                    await this.save('🔥');
                }
            }

            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-,ove-refactory-new'));
            const movedPath = path.join(fileStructure.path, 'renamed.ext');
            const file = new TestFile(path.join(fileStructure.path, 'file.ext'), fileStructure);
            const otherFile = new TestFile(path.join(fileStructure.path, 'other-file.ext'), fileStructure);
            await file.save('🚜');
            await otherFile.save('🚜');
            otherFile.addReference(file);

            await file.move({
                newPath: movedPath
            });

            try {
                const contents = await readFile(movedPath);
                expect(contents.toString()).to.equal('🔥');
            } catch (e) {
                expect(true).to.equal('`readFile` should not throw');
            }

            await otherFile.cleanup();
            await fileStructure.allFilesByPath[movedPath]!.cleanup();
        });

        it(`should throw an error if it can't refactor the file's references`, async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File {
                public async refactor (): Promise<void> {
                    throw new Error();
                }
            }

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-move-refactor-error'));
            const movedPath = path.join(fileStructure.path, 'renamed.ext');
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
            const otherFile = new TestFile(path.join(fileStructure.path, 'other-file.ext'), fileStructure);
            await file.save('🚜');
            await otherFile.save('🚜');
            otherFile.addReference(file);

            try {
                await file.move({
                    newPath: movedPath
                });
                expect(true).to.equal('`move` should throw');
            } catch (e) {
                expect(e).to.deep.equal(new TractorError(`Could not update references after moving "${file.path}".`));
            }

            await otherFile.cleanup();
            await fileStructure.allFilesByPath[movedPath]!.cleanup();
        });
    });

    describe('File.read:', () => {
        it('should read the file', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-read'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            await file.save('🚜');

            const content = await file.read();
            expect(content.toString()).to.equal('🚜');

            await file.cleanup();
        });

        it('should not read the file again if it has not been modified', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-read-once'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            await file.save('🚜');

            await file.read();
            const { buffer } = file;

            await file.read();
            const bufferAgain = file.buffer;

            expect(buffer).to.equal(bufferAgain);

            await file.cleanup();
        });

        it('should only read the file again if it has been modified', async () => {
            const writeFile = promisify(fs.writeFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-read-modified'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            // tslint:disable-next-line
            console.log('SAVING');

            await file.save('🚜');

            // tslint:disable-next-line
            console.log('READING');
            await file.read();
            const { buffer } = file;

            // tslint:disable-next-line
            console.log('WRITING FILE');
            // Write to file manually to force re-read:
            await writeFile(file.path, '🔥');

            // tslint:disable-next-line
            console.log('READING');
            await file.read();
            const bufferAgain = file.buffer;

            expect(buffer).to.not.equal(bufferAgain);

            await file.cleanup();
        });

        it(`should throw an error if it can't read the file`, async () => {
            const writeFile = promisify(fs.writeFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-read-error'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            await file.save('🚜');

            // HACK:
            // Overwrite `File.prototype._setData` to force an error to be thrown.
            // tslint:disable-next-line:no-any
            const proto = File.prototype as any;
            const setData = proto._setData;
            proto._setData = (): string => {
                throw new Error();
            };

            try {
                // Write to file manually to force re-read:
                await writeFile(file.path, '🔥');
                await file.read();
            } catch (e) {
                expect(e).to.deep.equal(new TractorError(`Cannot read "${path.join(directory.path, 'file.ext')}". Something went wrong.`));
            }

            proto._setData = setData;
            await file.cleanup();
        });
    });

    describe('File.refactor:', () => {
        it('should do nothing by default', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-refactor'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            try {
                await file.refactor('', {});
            } catch {
                expect(true).to.equal('`refactor` should not throw');
            }
        });
    });

    describe('File.save:', () => {
        it('should save the file', async () => {
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-save'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            await file.save('🚜');

            const content = await readFile(file.path);

            expect(content.toString()).to.equal('🚜');
            expect(file.content).to.equal('🚜');
            expect(file.buffer!.equals(Buffer.from('🚜'))).to.equal(true);

            await file.cleanup();
        });

        it('should make sure the parent directory is saved', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-save-directory'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            await file.save('🚜');

            try {
                await readdir(file.directory.path);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }

            await file.cleanup();
        });

        it(`should throw an error if it can't save the file`, async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-save-error'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            // HACK:
            // Overwrite `File.prototype._setData` to force an error to be thrown.
            // tslint:disable-next-line:no-any
            const proto = File.prototype as any;
            const setData = proto._setData;
            proto._setData = (): string => {
                throw new Error();
            };

            try {
                await file.save('🚜');
            } catch (e) {
                expect(e).to.deep.equal(new TractorError(`Cannot save "${path.join(directory.path, 'file.ext')}". Something went wrong.`));
            }

            proto._setData = setData;
            await file.cleanup();
        });
    });

    describe('File.serialise:', () => {
        it('should call `File.prototype.toJSON`', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            const serialised = file.serialise();

            expect(serialised).to.deep.equal({
                basename: 'file',
                extension: '.ext',
                path: path.join(fileStructure.path, 'file.ext'),
                referencedBy: [],
                references: [],
                url: '/file.ext'
            });
        });
    });

    describe('File.toJSON:', () => {
        it('should return specific properties of the object', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            const json = file.toJSON();

            expect(json).to.deep.equal({
                basename: 'file',
                extension: '.ext',
                path: path.join(fileStructure.path, 'file.ext'),
                referencedBy: [],
                references: [],
                url: '/file.ext'
            });
        });

        it('should contain the files that the file references', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
            const otherFile = new File(path.join(fileStructure.path, 'other-file.ext'), fileStructure);
            file.addReference(otherFile);

            const json = file.toJSON();

            expect(json.references).to.deep.equal([{
                basename: 'other-file',
                extension: '.ext',
                path: path.join(fileStructure.path, 'other-file.ext'),
                url: '/other-file.ext'
            }]);
        });

        it('should contain the files that reference the file', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
            const otherFile = new File(path.join(fileStructure.path, 'other-file.ext'), fileStructure);
            otherFile.addReference(file);

            const json = file.toJSON();

            expect(json.referencedBy).to.deep.equal([{
                basename: 'other-file',
                extension: '.ext',
                path: path.join(fileStructure.path, 'other-file.ext'),
                url: '/other-file.ext'
            }]);
        });
    });
});
