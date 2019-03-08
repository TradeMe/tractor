// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import * as path from 'path';
import * as socket from 'socket.io-client';
import { Directory } from '../structure/directory';
// import { File } from '../structure/file';
import { FileStructure } from '../structure/file-structure';

// Under test:
import { startTestServer } from '../../test/test-server';

describe('@tractor/file-structure - actions/watch-file-structure:', () => {
    it('should start watching the file structure', async () => {
        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures/actions-watch-file-structure'));
        const directory = new Directory(path.join(fileStructure.path, 'directory'), fileStructure);
        await directory.save();
        const port = 6666;
        const close = await startTestServer(fileStructure, port);

        const connection = socket.connect('http://localhost:6666/watch-file-structure/', {
            forceNew: true
        });

        const url = await new Promise((resolve): void => {
            connection.on('connect', async () => {
                await directory.delete();
            });
            connection.on('file-structure-change', (changeUrl: string) => {
                connection.close();
                resolve(changeUrl);
            });
        });

        expect(url).to.equal(fileStructure.url);

        await close();
        await fileStructure.structure.rimraf();
    });
});
