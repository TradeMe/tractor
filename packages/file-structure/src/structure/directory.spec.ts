// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import * as fs from 'graceful-fs';
import * as path from 'path';
import { promisify } from 'util';
import { File } from './file';
import { FileStructure } from './file-structure';

// Errors:
import { TractorError } from '@tractor/error-handler';

// Under test:
import { Directory } from './directory';

describe('@tractor/file-structure - Directory:', () => {
    describe('Directory constructor:', () => {
        it('should create a new Directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));

            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            expect(directory).to.be.an.instanceof(Directory);
        });

        it('should work out the directory name', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));

            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            expect(directory.name).to.equal('directory');
        });

        it('should work out the directory basename', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));

            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            expect(directory.basename).to.equal('directory');
        });

        it('should work out the URL to the directory from the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));

            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            expect(directory.url).to.equal('/directory');
        });

        it('should work out the parent directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            const subdirectory = new Directory(path.join(fileStructure.path, 'directory', 'sub-directory'), fileStructure);

            expect(subdirectory.directory).to.equal(directory);
        });

        it(`should create the parent directory if it doesn't exist`, () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));

            const subdirectory = new Directory(path.join(fileStructure.path, 'parent-directory', 'directory', 'sub-directory'), fileStructure);

            expect(subdirectory.directory).to.not.equal(undefined);
            expect(fileStructure.allDirectoriesByPath[path.join(fileStructure.path, 'parent-directory')]).to.not.equal(undefined);
            expect(fileStructure.allDirectoriesByPath[path.join(fileStructure.path, 'parent-directory', 'directory')]).to.not.equal(undefined);
        });

        it('should throw an error if the Directory path is outside the root of the FileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));

            expect(() => new Directory(path.join(path.sep, 'outside'), fileStructure))
            .to.throw(TractorError, `Cannot create "${path.join(path.sep, 'outside')}" because it is outside of the root of the FileStructure`);
        });

        it('should throw an error if a Directory has already been created for that path', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));

            // tslint:disable-next-line:no-unused-expression
            new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            expect(() => new Directory(path.join(fileStructure.path, 'directory'), fileStructure))
            .to.throw(TractorError, `Cannot create "${path.join(fileStructure.path, 'directory')}" because it already exists`);
        });
    });

    describe('Directory.addItem:', () => {
        it('should add a file to the directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            directory.addItem(file);

            expect(directory.files.length).to.equal(1);
            const [expectedFile] = directory.files;
            expect(expectedFile).to.equal(file);
        });

        it('should not add the file if it has already been added', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            directory.addItem(file);
            directory.addItem(file);

            expect(directory.files.length).to.equal(1);
        });

        it('should add the file to the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            directory.addItem(file);

            expect(fileStructure.allFilesByPath[path.join(directory.path, 'file.ext')]).to.equal(file);
        });

        it('should add a directory to the directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);

            directory.addItem(subdirectory);

            expect(directory.directories.length).to.equal(1);
            const [expectedDirectory] = directory.directories;
            expect(expectedDirectory).to.equal(subdirectory);
        });

        it('should not add the directory if it has already been added', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);

            directory.addItem(subdirectory);
            directory.addItem(subdirectory);

            expect(directory.directories.length).to.equal(1);
        });

        it('should add the directory to the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);

            directory.addItem(subdirectory);

            expect(fileStructure.allDirectoriesByPath[path.join(directory.path, 'sub-directory')]).to.equal(subdirectory);
        });
    });

    describe('Directory.cleanup:', () => {
        it('should delete the directory', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-cleanup'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            await directory.cleanup();

            try {
                await readdir(directory.path);
                expect(true).to.equal('`readdir` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }
        });

        it('should cleanup the parent directory', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-cleanup-parent'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            await directory.cleanup();

            try {
                await readdir(directory.directory!.path);
                expect(true).to.equal('`readdir` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }
        });

        it('should stop once it gets to the root of the FileStructure', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-cleanup-stop'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            await directory.cleanup();

            try {
                const dir = await readdir(path.resolve(fileStructure.path, '../'));
                expect(dir).to.not.equal(undefined);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }
        });

        it('should stop once it gets to a directory that is not empty', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-cleanup-not-empty'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);

            await file.save('🚜');
            await subdirectory.save();

            await subdirectory.cleanup();

            try {
                const dir = await readdir(directory.path);
                expect(dir).to.deep.equal(['file.ext']);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }

            await file.cleanup();
        });

        it('should rethrow if something unexpected goes wrong', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-cleanup-error'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            // HACK:
            // Overewrite `directory.delete` to force an error:
            const expectedError = new Error();
            const del = directory.delete;
            directory.delete = async (): Promise<void> => {
                throw expectedError;
            };

            try {
                await directory.cleanup();
                expect(true).to.equal('`cleanup` should throw');
            } catch (error) {
                expect(error).to.equal(expectedError);
            }

            directory.delete = del;
            await directory.cleanup();
        });
    });

    describe('Directory.delete:', () => {
        it('should delete the directory if it is empty', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/director-delete-empty'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            await directory.delete();

            try {
                await readdir(directory.path);
                expect(true).to.equal('`readdir` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }

            await fileStructure.structure.delete();
        });

        it('should remove itself from the file structure', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-delete-remove'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            await directory.delete();

            expect(fileStructure.structure.directories.includes(directory)).to.equal(false);
            expect(fileStructure.allDirectoriesByPath[directory.path]).to.equal(null);

            await fileStructure.structure.delete();
        });

        it('should remove itself from the FileStructure if it is the root directory', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-delete-root'));
            await fileStructure.structure.save();

            await fileStructure.structure.delete();

            expect(fileStructure.allDirectoriesByPath[fileStructure.path]).to.equal(null);
        });

        it('should throw if the directory is not empty', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-delete-not-empty'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);
            await file.save('🚜');
            await subdirectory.save();

            try {
                await directory.delete();
            } catch (error) {
                expect(error).to.deep.equal(new TractorError(`Cannot delete "${directory.path}" because it is not empty`));
            }

            await file.cleanup();
            await subdirectory.cleanup();
        });

        it('should throw if something unexpected goes wrong', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-delete-error'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            // HACK:
            // Overewrite `directory.parent.removeItem` to force an error:
            const removeItem = directory.parent.removeItem;
            directory.parent.removeItem = (): void => {
                throw new Error();
            };

            try {
                await directory.delete();
                expect(true).to.equal('`delete` should throw');
            } catch (error) {
                expect(error).to.deep.equal(new TractorError(`Cannot delete "${directory.path}". Something went wrong.`));
            }

            directory.parent.removeItem = removeItem;
            directory.parent.removeItem(directory);
            await fileStructure.structure.rimraf();
        });
    });

    describe('Directory.move:', () => {
        it('should move a directory', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-move'));
            const originalPath = path.join(fileStructure.path, 'directory');
            const movedPath = path.join(fileStructure.path, 'other-directory');
            const directory = new Directory(originalPath, fileStructure);
            await directory.save();

            await directory.move({
                newPath: movedPath
            });

            try {
                const dir = await readdir(movedPath);
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }

            try {
                await readdir(originalPath);
                expect(true).to.equal('`readdir` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }

            await fileStructure.structure.rimraf();
        });

        it('should copy a directory', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-move-copy'));
            const originalPath = path.join(fileStructure.path, 'directory');
            const movedPath = path.join(fileStructure.path, 'other-directory');
            const directory = new Directory(originalPath, fileStructure);

            await directory.save();
            await directory.move({
                newPath: movedPath
            }, {
                isCopy: true
            });

            try {
                const dir = await readdir(movedPath);
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }

            try {
                const dir = await readdir(originalPath);
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }

            await fileStructure.structure.rimraf();
        });

        it('should move all the children items', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-move-children'));
            const originalPath = path.join(fileStructure.path, 'directory');
            const movedPath = path.join(fileStructure.path, 'other-directory');
            const directory = new Directory(originalPath, fileStructure);
            const subDirectory1 = new Directory(path.join(originalPath, 'sub-directory-1'), fileStructure);
            const subDirectory2 = new Directory(path.join(originalPath, 'sub-directory-2'), fileStructure);
            await subDirectory1.save();
            await subDirectory2.save();

            await directory.move({
                newPath: movedPath
            });

            try {
                const dir = await readdir(path.join(movedPath, 'sub-directory-1'));
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }

            try {
                const dir = await readdir(path.join(movedPath, 'sub-directory-2'));
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }

            await fileStructure.structure.rimraf();
        });
    });

    describe('Directory.read:', () => {
        it('should read the directory', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-read'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);
            await subdirectory.save();

            const dir = await directory.read();

            expect(dir).to.deep.equal(['sub-directory']);

            await subdirectory.cleanup();
        });

        it('should should not read the directory while it is already being read', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-read-reuse'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            const reading = directory.read();
            const readingAgain = directory.read();

            expect(await reading).to.equal(await readingAgain);

            await directory.cleanup();
        });

        it('should read any directories contained within the Directory', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            await directory.read();

            expect(directory.directories.length).to.equal(1);
        });

        it('should create a rich model for files of a known type', async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File { }
            TestFile.prototype.extension = '.ext';

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            fileStructure.addFileType(TestFile);
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const filePath = path.join(directory.path, 'directory', 'test.ext');

            await directory.read();

            expect(fileStructure.allFilesByPath[filePath] instanceof TestFile).to.equal(true);
        });

        it('should create a rich model for files of a known type with multiple extensions', async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestMultiFile extends File { }
            TestMultiFile.prototype.extension = '.multi.ext';

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            fileStructure.addFileType(TestMultiFile);
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const filePath = path.join(directory.path, 'directory', 'test.multi.ext');

            await directory.read();

            expect(fileStructure.allFilesByPath[filePath] instanceof TestMultiFile).to.equal(true);
        });

        it('should not create a model for any files of an unknown type', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const filePath = path.join(directory.path, 'directory', '.dotfile');

            await directory.read();

            expect(fileStructure.allFilesByPath[filePath]).to.equal(undefined);
        });
    });

    describe('Directory.removeItem:', () => {
        it('should remove a file from the directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory'));
            const directory = new Directory(path.join(fileStructure.path, 'remove-item'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            directory.removeItem(file);

            expect(directory.files.includes(file)).to.equal(false);
        });

        it('should remove the file from the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory'));
            const directory = new Directory(path.join(fileStructure.path, 'remove-item'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);

            directory.removeItem(file);

            expect(fileStructure.allFilesByPath[file.path]).to.equal(null);
        });

        it('should remove a directory from the directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory'));
            const directory = new Directory(path.join(fileStructure.path, 'remove-item'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);

            directory.removeItem(subdirectory);

            expect(directory.directories.includes(subdirectory)).to.equal(false);
        });

        it('should remove the directory from the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory'));
            const directory = new Directory(path.join(fileStructure.path, 'remove-item'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);

            directory.removeItem(subdirectory);

            expect(fileStructure.allDirectoriesByPath[subdirectory.path]).to.equal(null);
        });
    });

    describe('Directory.rimraf:', () => {
        it('should delete the directory', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-rimraf'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            await directory.rimraf();

            try {
                await readdir(directory.path);
                expect(true).to.equal('`readdir` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }

            await fileStructure.structure.cleanup();
        });

        it('should remove itself from its parent', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-rimraf-remove-parent'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            await directory.rimraf();

            expect(directory.directory!.directories.includes(directory)).to.equal(false);
            await fileStructure.structure.cleanup();
        });

        it('should remove itself from the FileStructure if it is the root direction', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-rimraf-root'));
            await fileStructure.structure.save();

            await fileStructure.structure.rimraf();

            expect(fileStructure.allDirectoriesByPath[fileStructure.structure.path]).to.equal(null);
        });

        it('should delete all its sub-directories', async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-rimraf-directories'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);
            await subdirectory.save();

            await directory.rimraf();

            try {
                await readdir(subdirectory.path);
                expect(true).to.equal('`readdir` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }

            try {
                await readdir(directory.path);
                expect(true).to.equal('`readdir` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }

            await fileStructure.structure.cleanup();
        });

        it('should delete all its files', async () => {
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-rimraf-files'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
            await file.save('🚜');

            await directory.rimraf();

            try {
                await readFile(file.path);
                expect(true).to.equal('`readFile` should throw');
            } catch (e) {
                expect(e.code).to.equal('ENOENT');
            }

            await fileStructure.structure.cleanup();
        });
    });

    describe('Directory.save:', () => {
        it('should should do nothing if the directory already exists', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-save-already-exists'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
            await directory.save();

            expect(async () => {
                await directory.save();
            }).to.not.throw();

            await directory.cleanup();
        });

        it(`should save the directory if it doesn't exist yet`, async () => {
            const readdir = promisify(fs.readdir);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-save-doesnt-exist'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            await directory.save();

            try {
                const dir = await readdir(directory.path);
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }

            await directory.cleanup();
        });

        it.skip(`should throw an error if it can't save the directory`, async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/directory-save-error'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            // TODO:
            // Figure out a not awful way to make this throw:
            try {
                await directory.save();
            } catch (e) {
                expect(e).to.deep.equal(new TractorError(`Cannot save "${path.join(directory.path)}". Something went wrong.`));
            }

            await directory.save();
            await fileStructure.structure.rimraf();
        });
    });

    describe('Directory.toJSON:', () => {
        it('should return important properties of the directory', () => {
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            const subdirectory = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory'), fileStructure);
            const file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

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
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            const subdirectory1 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-z'), fileStructure);
            const subdirectory2 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-a'), fileStructure);
            const subdirectory3 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-f'), fileStructure);
            const subdirectory4 = new Directory(path.join(path.sep, 'file-structure', 'directory', 'sub-directory-b'), fileStructure);

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
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
            const file1 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-z.ext'), fileStructure);
            const file2 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-a.ext'), fileStructure);
            const file3 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-f.ext'), fileStructure);
            const file4 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-b.ext'), fileStructure);

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
