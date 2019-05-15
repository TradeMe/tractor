// Test setup:
import { getPort, expect } from '@tractor/unit-test';

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

describe('@tractor/file-structure - actions/move-item:', () => {
    it('should move a file', async () => {
        jest.retryTimes(3);
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-move-item-file'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = await getPort();
        const close = await startTestServer(fileStructure, port);

        const response = await fetch(`http://localhost:${port}/fs/move/file.ext`, {
            body: JSON.stringify({ newUrl: path.join(fileStructure.url, 'moved.ext') }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            await readFile(path.join(fileStructure.path, 'file.ext'));
            expect(true).to.equal('`readFile` should throw');
        } catch (e) {
            expect(e.code).to.equal('ENOENT');
        }
        try {
            const content = await readFile(path.join(fileStructure.path, 'moved.ext'));
            expect(content.toString()).to.equal('🚜');
        } catch (e) {
            expect(true).to.equal('`readFile` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should copy a file', async () => {
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-move-item-copy-file'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = await getPort();
        const close = await startTestServer(fileStructure, port);

        const response = await fetch(`http://localhost:${port}/fs/move/file.ext`, {
            body: JSON.stringify({ copy: true }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            const content = await readFile(path.join(fileStructure.path, 'file.ext'));
            expect(content.toString()).to.equal('🚜');
        } catch (e) {
            expect(true).to.equal('`readFile` should not throw');
        }
        try {
            const content = await readFile(path.join(fileStructure.path, 'file (1).ext'));
            expect(content.toString()).to.equal('🚜');
        } catch (e) {
            expect(true).to.equal('`readFile` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it.skip('should move a directory', async () => {
        jest.retryTimes(3);
        const readdir = promisify(fs.readdir);
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-move-item-directory'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        await directory.save();
        const port = await getPort();
        const close = await startTestServer(fileStructure, port);

        const response = await fetch(`http://localhost:${port}/fs/move/directory`, {
            body: JSON.stringify({ newUrl: path.join(fileStructure.url, 'moved') }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
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
            const dir = await readdir(path.join(fileStructure.path, 'moved'));
            expect(dir).to.deep.equal([]);
        } catch (e) {
            expect(true).to.equal('`readdir` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should copy a directory', async () => {
        const readdir = promisify(fs.readdir);
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-move-item-copy-directory'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        await directory.save();
        const port = await getPort();
        const close = await startTestServer(fileStructure, port);

        const response = await fetch(`http://localhost:${port}/fs/move/directory`, {
            body: JSON.stringify({ copy: true }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            const dir = await readdir(path.join(fileStructure.path, 'directory'));
            expect(dir).to.deep.equal([]);
        } catch {
            expect(true).to.equal('`readdir` should not throw');
        }
        try {
            const dir = await readdir(path.join(fileStructure.path, 'directory (1)'));
            expect(dir).to.deep.equal([]);
        } catch (e) {
            expect(true).to.equal('`readdir` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it(`should throw an error if it can't find the item to move`, async () => {
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-move-item-404'));
        await fileStructure.structure.save();
        const port = await getPort();
        const close = await startTestServer(fileStructure, port);

        const response = await fetch(`http://localhost:${port}/fs/move/directory`, {
            body: JSON.stringify({ copy: true }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        const { error } = await response.json();

        expect(error).to.equal(`Could not find "${path.join(fileStructure.path, 'directory')}"`);

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should handle known TractorErrors', async () => {
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-move-item-known-error'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        await directory.save();
        const port = await getPort();
        const close = await startTestServer(fileStructure, port);

        const expectedError = new TractorError(`Cannot save "${directory.path}". Something went wrong.`);
        jest.spyOn(directory, 'move').mockImplementation(async () => {
            throw expectedError;
        });

        const response = await fetch(`http://localhost:${port}/fs/move/directory`, {
            body: JSON.stringify({ newUrl: path.join(fileStructure.url, 'moved') }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const { error } = await response.json();
        expect(error).to.equal(expectedError.message);

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should handle known TractorErrors', async () => {
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-move-item-known-error'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        await directory.save();
        const port = await getPort();
        const close = await startTestServer(fileStructure, port);

        jest.spyOn(directory, 'move').mockImplementation(async () => {
            throw new Error();
        });

        const response = await fetch(`http://localhost:${port}/fs/move/directory`, {
            body: JSON.stringify({ newUrl: path.join(fileStructure.url, 'moved') }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const { error } = await response.json();
        expect(error).to.equal(`Could not move "${directory.path}"`);

        await close();
        await fileStructure.structure.rimraf();
    });
});
