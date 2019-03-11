// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as fs from 'graceful-fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { promisify } from 'util';
import { Directory } from '../structure/directory';
import { File } from '../structure/file';
import { FileStructure } from '../structure/file-structure';

// Under test:
import { startTestServer } from '../../test/test-server';

describe('@tractor/file-structure - actions/delete-item:', () => {
    it('should delete a file', async () => {
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-file'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 5555;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:5555/fs/file.ext', {
            method: 'DELETE'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            await readFile(path.join(fileStructure.path, 'file.ext'));
            expect(true).to.equal('`readFile` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should delete a directory', async () => {
        const readdir = promisify(fs.readdir);
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-directory'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        await directory.save();
        const port = 5556;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:5556/fs/directory', {
            method: 'DELETE'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            await readdir(path.join(fileStructure.path, 'directory'));
            expect(true).to.equal('`readdir` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it(`should throw an error if it can't find the item to delete`, async () => {
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-404'));
        await fileStructure.structure.save();
        const port = 5557;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:5557/fs/directory', {
            method: 'DELETE'
        });
        const { error } = await response.json();

        expect(error).to.equal(`Could not find "${path.join(fileStructure.path, 'directory')}"`);

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should rimraf a directory', async () => {
        const readdir = promisify(fs.readdir);
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-rimraf'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);
        await subdirectory.save();
        const port = 5558;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:5558/fs/directory?rimraf=true', {
            method: 'DELETE'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            await readdir(path.join(fileStructure.path, 'directory'));
            expect(true).to.equal('`readdir` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should fall back to delete if `rimraf` is passed but the item is not a directory', async () => {
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-rimraf-file'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 5559;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:5559/fs/file.ext?rimraf', {
            method: 'DELETE'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            await readFile(path.join(fileStructure.path, 'file.ext'));
            expect(true).to.equal('`readFile` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    // TODO:
    // Figure out why this fails in Travis, but works locally
    xit('should cleanup a file', async () => {
        const readdir = promisify(fs.readdir);
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-cleanup-file'));
        fileStructure.addFileType(TestFile);
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        const file = new File(path.join(directory.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 5560;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:5560/fs/directory/file.ext?cleanup=true', {
            method: 'DELETE'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            await readdir(path.join(fileStructure.path, 'directory'));
            expect(true).to.equal('`readdir` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }
        try {
            await readFile(path.join(fileStructure.path, 'directory', 'file.ext'));
            expect(true).to.equal('`readFile` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }

        await close();
    });

    // TODO:
    // Figure out why this fails in Travis, but works locally
    xit('should cleanup a directory', async () => {
        const readdir = promisify(fs.readdir);
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-cleanup-directory'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        const subdirectory = new Directory(path.join(directory.path, 'sub-directory'), fileStructure);
        await subdirectory.save();
        const port = 5561;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:5561/fs/directory/sub-directory?cleanup=true', {
            method: 'DELETE'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            await readdir(path.join(fileStructure.path, 'directory'));
            expect(true).to.equal('`readdir` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }
        try {
            await readdir(path.join(fileStructure.path, 'directory', 'sub-directory'));
            expect(true).to.equal('`readdir` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }

        await close();
    });

    it('should handle known TractorErrors', async () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-known-error'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 5562;
        const close = await startTestServer(fileStructure, port);

        const expectedError = new TractorError(`Could not delete "${file.path}". Something went wrong.`);
        const del = jest.spyOn(file, 'delete').mockImplementation(async () => {
            throw expectedError;
        });

        const response = await fetch('http://localhost:5562/fs/file.ext', {
            method: 'DELETE'
        });

        const { error } = await response.json();
        expect(error).to.equal(expectedError.message);

        await close();
        del.mockRestore();
        await fileStructure.structure.rimraf();
    });

    it('should handle unknown errors', async () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-delete-item-unknown-error'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 5563;
        const close = await startTestServer(fileStructure, port);

        const del = jest.spyOn(file, 'delete').mockImplementation(async () => {
            throw new Error();
        });

        const response = await fetch('http://localhost:5563/fs/file.ext', {
            method: 'DELETE'
        });

        const { error } = await response.json();
        expect(error).to.equal(`Could not delete "${file.path}"`);

        await close();
        del.mockRestore();
        await fileStructure.structure.rimraf();
    });
});
