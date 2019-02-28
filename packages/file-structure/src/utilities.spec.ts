// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { promisify } from 'util';
import { File } from './structure/file';
import { FileStructure } from './structure/file-structure';

// Under test:
import { copyFile, createDir, createDirIfMissing, readFiles } from './utilities';

describe('@tractor/file-structure - utilities:', () => {
    describe('@tractor/file-structure - utilities/copyFile:', () => {
        it('should copy a file', async () => {
            const readFile = promisify(fs.readFile);
            const unlink = promisify(fs.unlink);
            const copyFromPath = path.resolve(__dirname, '../fixtures/utilities/test.ext');
            const copyToPath = path.resolve(__dirname, '../fixtures/utilities/copy.ext');
            try {
                await unlink(copyToPath);
            } catch {
                // ignore the error.
            }

            await copyFile(copyFromPath, copyToPath);

            try {
                const content = await readFile(copyToPath);
                expect(content.toString()).to.equal('🚜\n');
            } catch {
                expect(true).to.equal('`readFile` should not throw');
            }
        });

        it('should throw if the destination already exists', async () => {
            const writeFile = promisify(fs.writeFile);
            const copyFromPath = path.resolve(__dirname, '../fixtures/utilities/test.ext');
            const copyToPath = path.resolve(__dirname, '../fixtures/utilities/copy-exists.ext');
            try {
                await writeFile(copyToPath, '🔥');
            } catch {
                // ignore the error.
            }

            try {
                await copyFile(copyFromPath, copyToPath);
                expect(true).to.equal('`copyFile` should throw');
            } catch (e) {
                expect(e).to.deep.equal(new TractorError(`"${copyToPath}" already exists.`));
            }
        });
    });

    describe('@tractor/file-structure - utilities/createDir:', () => {
        it('should create a directory', async () => {
            const readdir = promisify(fs.readdir);
            const rmdir = promisify(fs.rmdir);
            const createPath = path.resolve(__dirname, '../fixtures/utilities/directory');

            try {
                await rmdir(createPath);
            } catch {
                // ignore the error.
            }

            await createDir(createPath);

            try {
                const dir = await readdir(createPath);
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }
        });

        it('should throw if the destination already exists', async () => {
            const mkdir = promisify(fs.mkdir);
            const createPath = path.resolve(__dirname, '../fixtures/utilities/directory');

            try {
                await mkdir(createPath);
            } catch {
                // ignore the error.
            }

            try {
                await createDir(createPath);
                expect(true).to.equal('`createDir` should throw');
            } catch (e) {
                expect(e).to.deep.equal(new TractorError(`"${createPath}" already exists.`));
            }
        });
    });

    describe('@tractor/file-structure - utilities/createDir:', () => {
        it(`should create a directory if it doesn't exist`, async () => {
            const readdir = promisify(fs.readdir);
            const rmdir = promisify(fs.rmdir);
            const createPath = path.resolve(__dirname, '../fixtures/utilities/directory');

            try {
                await rmdir(createPath);
            } catch {
                // ignore the error.
            }

            await createDirIfMissing(createPath);

            try {
                const dir = await readdir(createPath);
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`readdir` should not throw');
            }
        });

        it('should do nothing if the destination already exists', async () => {
            const readdir = promisify(fs.readdir);
            const mkdir = promisify(fs.mkdir);
            const createPath = path.resolve(__dirname, '../fixtures/utilities/directory');

            try {
                await mkdir(createPath);
            } catch {
                // ignore the error.
            }

            try {
                await createDirIfMissing(createPath);
                const dir = await readdir(createPath);
                expect(dir).to.deep.equal([]);
            } catch {
                expect(true).to.equal('`createDir` should not throw');
            }
        });
    });

    describe('@tractor/file-structure - utilities/readFiles:', () => {
        it('should create a FileStructure from a path', async () => {
            // tslint:disable-next-line:max-classes-per-file
            class TestFile extends File { }
            TestFile.prototype.extension = '.ext';
            const fileStructure = await readFiles(path.resolve(__dirname, '../fixtures/file-structure'), [TestFile]);

            expect(fileStructure).to.be.an.instanceOf(FileStructure);
            const expectedLength = 2;
            expect(fileStructure.structure.files.length).to.equal(expectedLength);
        });
    });
});
