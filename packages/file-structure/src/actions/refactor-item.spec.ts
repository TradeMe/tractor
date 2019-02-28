// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import fetch from 'node-fetch';
import * as path from 'path';
import { File } from '../structure/file';
import { FileStructure } from '../structure/file-structure';

// Under test:
import { startTestServer } from '../../test/test-server';

describe('@tractor/file-structure - actions/refactor-item:', () => {
    it('should refactor a file', async () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-refactor-item-file'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 7777;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:7777/fs/refactor/file.ext', {
            method: 'POST'
        });
        const data = await response.text();

        expect(data).to.equal('OK');

        await close();
        await fileStructure.structure.rimraf();
    });

    it(`should throw an error if it can't find the file to refactor`, async () => {
        // tslint:disable-next-line:max-classes-per-file
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-refactor-item-404'));
        await fileStructure.structure.save();
        const port = 7778;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:7778/fs/refactor/file.ext', {
            method: 'POST'
        });
        const { error } = await response.json();

        expect(error).to.equal(`Could not find "${path.join(fileStructure.path, 'file.ext')}"`);

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should handle known TractorErrors', async () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-refactor-item-known-error'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 7779;
        const close = await startTestServer(fileStructure, port);

        const expectedError = new TractorError(`Could not refactor "${file.path}". Something went wrong.`);
        const refactor = jest.spyOn(file, 'refactor').mockImplementation(async () => {
            throw expectedError;
        });

        const response = await fetch('http://localhost:7779/fs/refactor/file.ext', {
            method: 'POST'
        });

        const { error } = await response.json();
        expect(error).to.equal(expectedError.message);

        await close();
        refactor.mockRestore();
        await fileStructure.structure.rimraf();
    });

    it('should handle unknown error', async () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-refactor-item-unknown-error'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 7780;
        const close = await startTestServer(fileStructure, port);

        const refactor = jest.spyOn(file, 'refactor').mockImplementation(async () => {
            throw new Error();
        });

        const response = await fetch('http://localhost:7780/fs/refactor/file.ext', {
            method: 'POST'
        });

        const { error } = await response.json();
        expect(error).to.equal(`Could not refactor "${file.path}"`);

        await close();
        refactor.mockRestore();
        await fileStructure.structure.rimraf();
    });
});
