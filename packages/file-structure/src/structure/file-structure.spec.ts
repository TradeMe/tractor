// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import * as path from 'path';
import { Directory } from './directory';
import { File } from './file';

// Under test:
import { FileStructure } from './file-structure';

describe('@tractor/file-structure - FileStructure:', () => {
    describe('FileStructure constructor:', () => {
        it('should create a new FileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));

            expect(fileStructure).to.be.an.instanceof(FileStructure);
        });

        it('should initalise its interal data structures', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));

            expect(fileStructure.allFilesByPath).to.deep.equal({ });
            expect(Object.keys(fileStructure.allDirectoriesByPath).length).to.equal(1);
        });

        it('should create the root directory', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));

            expect(fileStructure.structure).to.be.an.instanceof(Directory);
            expect(fileStructure.structure.path).to.equal(path.resolve(__dirname, '../../fixtures/file-structure'));
        });

        it('should set a default URL', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));

            expect(fileStructure.url).to.equal('/');
        });

        it('should set a custom URL', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'), 'file-structure');

            expect(fileStructure.url).to.equal('/file-structure/');
        });
    });

    describe('FileStructure.addFileType', () => {
        it('should add a type of file that the FileStructure can create', () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File {
                public async save (_: string | Buffer): Promise<string> {
                    return '';
                }
            }
            TestFile.prototype.extension = '.ext';

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            fileStructure.addFileType(TestFile);

            expect(fileStructure.fileTypes['.ext']).to.equal(TestFile);
        });
    });

    describe('FileStructure.addItem:', () => {
        it('should add a file to the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            const file = new File(path.join(fileStructure.path, 'file'), fileStructure);

            fileStructure.removeItem(file);
            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, 'file')]).to.equal(null);

            fileStructure.addItem(file);

            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, 'file')]).to.equal(file);
        });

        it('should add a directory to the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            fileStructure.removeItem(directory);

            expect(fileStructure.allDirectoriesByPath[path.join(fileStructure.path, 'directory')]).to.equal(null);

            fileStructure.addItem(directory);

            expect(fileStructure.allDirectoriesByPath[path.join(fileStructure.path, 'directory')]).to.equal(directory);
        });
    });

    describe('FileStructure.read', () => {
        it('should read the entire file structure', async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File { }
            TestFile.prototype.extension = '.ext';

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            fileStructure.addFileType(TestFile);

            await fileStructure.read();

            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, 'test.ext')]!.content).to.equal('🚜\n');
        });

        it('should read the entire file structure including files with complicated extensions', async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File { }
            TestFile.prototype.extension = '.ext';
            // tslint:disable-next-line:max-classes-per-file
            class TestMultiFile extends File { }
            TestMultiFile.prototype.extension = '.multi.ext';

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            fileStructure.addFileType(TestFile);
            fileStructure.addFileType(TestMultiFile);

            await fileStructure.read();

            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, 'test.ext')]!.content).to.equal('🚜\n');
            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, 'test.multi.ext')]!.content).to.equal('🔥\n');
        });

        it(`should skip files with extensions that it doesn't know about`, async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File { }
            TestFile.prototype.extension = '.ext';

            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            fileStructure.addFileType(TestFile);

            await fileStructure.read();

            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, 'test.ext')]!.content).to.equal('🚜\n');
            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, '.dotfile')]).to.equal(undefined);
        });
    });

    describe('FileStructure.removeItem:', () => {
        it('should remove a file from the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);

            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, 'file.ext')]).to.equal(file);

            fileStructure.removeItem(file);

            expect(fileStructure.allFilesByPath[path.join(fileStructure.path, 'file.ext')]).to.equal(null);
        });

        it('should remove a directory from the fileStructure', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);

            expect(fileStructure.allDirectoriesByPath[path.join(fileStructure.path, 'directory')]).to.equal(directory);

            fileStructure.removeItem(directory);

            expect(fileStructure.allDirectoriesByPath[path.join(fileStructure.path, 'directory')]).to.equal(null);
        });
    });

    describe('FileStructure.watch:', () => {
        it('should set up a watcher on the file structure', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));

            const watcher = fileStructure.watch();

            const ready = await new Promise((resolve): void => {
                watcher.on('ready', () => {
                    resolve(true);
                });
            });

            expect(ready).to.equal(true);

            fileStructure.unwatch();
        });

        it('should emit the directory that changed when a file within the structure changes', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            const file = new File(path.join(fileStructure.path, 'change.ext'), fileStructure);

            const watcher = fileStructure.watch();

            const [changeDirectory] = await Promise.all([
                new Promise((resolve): void => {
                    watcher.on('change', url => {
                        resolve(url);
                    });
                }),
                new Promise((resolve): void => {
                    watcher.on('ready', async () => {
                        await file.save('🚜');
                        resolve();
                    });
                })
            ]);

            expect(changeDirectory).to.equal(fileStructure.structure);

            fileStructure.unwatch();
        });

        it('should emit the directory that changed when a file within the structure is deleted', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/file-structure'));
            const file = new File(path.join(fileStructure.path, 'delete.ext'), fileStructure);
            await file.save('🚜');

            const watcher = fileStructure.watch();

            const [changeDirectory] = await Promise.all([
                new Promise((resolve): void => {
                    watcher.on('change', url => {
                        resolve(url);
                    });
                }),
                new Promise((resolve): void => {
                    watcher.on('ready', async () => {
                        await file.delete();
                        resolve();
                    });
                })
            ]);

            expect(changeDirectory).to.equal(fileStructure.structure);

            fileStructure.unwatch();
        });
    });
});
