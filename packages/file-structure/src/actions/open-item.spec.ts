// Test setup:
import { expect } from '@tractor/unit-test';

// // Dependencies:
import fetch from 'node-fetch';
import * as path from 'path';
import { Directory } from '../structure/directory';
import { File } from '../structure/file';
import { FileStructure } from '../structure/file-structure';

// Under test:
import { startTestServer } from '../../test/test-server';

describe('@tractor/file-structure - actions/open-item:', () => {
    it('should open a file', async () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFile extends File { }
        TestFile.prototype.extension = '.ext';
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-open-item-file'));
        fileStructure.addFileType(TestFile);
        const file = new File(path.join(fileStructure.path, 'file.ext'), fileStructure);
        await file.save('🚜');
        const port = 4444;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:4444/fs/file.ext');
        const { basename, extension, url } = await response.json();

        expect(basename).to.equal('file');
        expect(extension).to.equal('.ext');
        expect(url).to.equal('/file.ext');

        await close();
        await fileStructure.structure.rimraf();
    });

    it('should open a directory', async () => {
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-open-item-directory'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        directory.save();
        const port = 4445;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:4445/fs/directory');
        const { basename, url } = await response.json();

        expect(basename).to.equal('directory');
        expect(url).to.equal('/directory');

        await close();
        await fileStructure.structure.rimraf();
    });

    it(`should throw an error if it can't find the file to open`, async () => {
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-open-item-404'));
        await fileStructure.structure.save();
        const port = 4446;
        const close = await startTestServer(fileStructure, port);

        const response = await fetch('http://localhost:4446/fs/directory');
        const { error } = await response.json();

        expect(error).to.equal(`Could not find "${path.join(fileStructure.path, 'directory')}"`);

        await close();
        await fileStructure.structure.rimraf();
    });
});
