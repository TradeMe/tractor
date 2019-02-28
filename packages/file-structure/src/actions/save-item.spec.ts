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

describe('@tractor/file-structure - actions/save-item:', () => {
    it('should save a file', async () => {
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-save-file'));
        fileStructure.addFileType(TestFile);
        const port = 3333;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:3333/fs/file.ext', {
            body: JSON.stringify({ data: '🚜' }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            const contents = await readFile(path.join(fileStructure.path, 'file.ext'));
            expect(contents.toString()).to.equal('🚜');
        } catch {
            expect(true).to.equal('`readFile` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should save a new file with multiple extensions', async () => {
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestMultiFile extends File { }
        TestMultiFile.prototype.extension = '.multi.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-save-file-multi-extension'));
        fileStructure.addFileType(TestMultiFile);
        const port = 3334;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:3334/fs/file.multi.ext', {
            body: JSON.stringify({ data: '🚜' }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            const contents = await readFile(path.join(fileStructure.path, 'file.multi.ext'));
            expect(contents.toString()).to.equal('🚜');
        } catch {
            expect(true).to.equal('`readFile` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should throw if it is an unknown file type', async () => {
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-save-file-unknown-extension'));
        const port = 3335;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:3335/fs/file.ext', {
            body: JSON.stringify({ data: '🚜' }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
        const { error } = await response.json();

        expect(error).to.equal(`Could not save "${path.join(fileStructure.path, 'file.ext')}" as it is not a supported file type.`);

        await close();
    });

    it('should increment the name if a file already exists', async () => {
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-save-file-rename'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 3336;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch(`http://localhost:3336/fs${file.url}`, {
            body: JSON.stringify({ data: '🚜' }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            const contents = await readFile(path.join(fileStructure.path, 'file (1).ext'));
            expect(contents.toString()).to.equal('🚜');
        } catch {
            expect(true).to.equal('`readFile` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should overwrite an existing file', async () => {
        const readFile = promisify(fs.readFile);
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-overwrite-file'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 3337;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch(`http://localhost:3337/fs${file.url}`, {
            body: JSON.stringify({ data: '🔥', overwrite: true }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            const contents = await readFile(file.path);
            expect(contents.toString()).to.equal('🔥');
        } catch {
            expect(true).to.equal('`readFile` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should save a directory', async () => {
        const readdir = promisify(fs.readdir);
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-save-directory'));
        const port = 3338;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:3338/fs/directoryt', {
            body: JSON.stringify({ }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            const dir = await readdir(path.join(fileStructure.path, 'directoryt'));
            expect(dir).to.deep.equal([]);
        } catch {
            expect(true).to.equal('`readdir` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should increment the name if a directory already exists', async () => {
        const readdir = promisify(fs.readdir);
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-save-directory-rename'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        await directory.save();
        const port = 3339;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch(`http://localhost:3339/fs${directory.url}`, {
            body: JSON.stringify({ }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.text();

        expect(data).to.equal('OK');
        try {
            const dir = await readdir(path.join(fileStructure.path, 'directory (1)'));
            expect(dir).to.deep.equal([]);
        } catch {
            expect(true).to.equal('`readdir` should not throw');
        }

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should handle known TractorErrors', async () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-save-known-errors'));
        fileStructure.addFileType(TestFile);
        const file = new TestFile(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 3340;
        const close = await startTestServer(fileStructure, port);

        const expectedError = new TractorError(`Cannot save "${file.path}". Something went wrong.`);
        jest.spyOn(file, 'save').mockImplementation(async () => {
            throw expectedError;
        });

        const response = await fetch(`http://localhost:3340/fs${file.url}`, {
            body: JSON.stringify({ data: '🔥', overwrite: true }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        const { error } = await response.json();
        expect(error).to.equal(expectedError.message);

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should handle unknown errors', async () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-save-unknown-errors'));
        fileStructure.addFileType(TestFile);
        const file = new TestFile(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 3341;
        const close = await startTestServer(fileStructure, port);

        jest.spyOn(file, 'save').mockImplementation(async () => {
            throw new Error();
        });

        const response = await fetch(`http://localhost:3341/fs${file.url}`, {
            body: JSON.stringify({ data: '🔥', overwrite: true }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        const { error } = await response.json();
        expect(error).to.equal(`Could not save "${file.path}"`);

        await close();
        await fileStructure.structure.rimraf();
    });
});
