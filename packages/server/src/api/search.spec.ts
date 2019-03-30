// Test setup:
import { getPort, expect } from '@tractor/unit-test';

// Dependencies:
import fetch from 'node-fetch';
import { File, FileStructure } from '@tractor/file-structure';
import * as path from 'path';

// Under test:
import { startTestServer, timeout } from '../../test/test-server';

describe('@tractor/server - api: search', () => {
    it('should respond with no results initially', async () => {
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        const response = await fetch(`http://localhost:${port}/search?searchString=test`, {
            method: 'GET'
        });
        const data = await response.json();

        expect(data).to.deep.equal({
            count: 0,
            results: []
        });

        await close();
    });

    it('should return search results after some Files have been processed', async () => {
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        class TractorConfigFile extends File { }
        TractorConfigFile.prototype.extension = '.tractor.conf.js';

        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
        fileStructure.addFileType(TractorConfigFile);
        await fileStructure.read();

        await timeout(1500);

        const response = await fetch(`http://localhost:${port}/search?searchString=test`, {
            method: 'GET'
        });
        const { count, results } = await response.json();

        expect(count).to.equal(1);

        const [testTractorConf] = results;
        expect(testTractorConf.basename).to.equal('test');
        expect(testTractorConf.extension).to.equal('.tractor.conf.js');
        expect(testTractorConf.url).to.equal('/test.tractor.conf.js');

        await close();
    });

    it('should return only return one result per File, even if it has been read multiple times', async () => {
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        class TractorConfigFile extends File { }
        TractorConfigFile.prototype.extension = '.tractor.conf.js';

        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
        fileStructure.addFileType(TractorConfigFile);
        await fileStructure.read();
        await fileStructure.read();

        await timeout(1500);

        const response = await fetch(`http://localhost:${port}/search?searchString=test`, {
            method: 'GET'
        });
        const { count } = await response.json();

        expect(count).to.equal(1);

        await close();
    });

    it('should reindex whenever a File is saved', async () => {
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        class TractorConfigFile extends File { }
        TractorConfigFile.prototype.extension = '.tractor.conf.js';

        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
        fileStructure.addFileType(TractorConfigFile);
        await fileStructure.read();
        const file = new TractorConfigFile(path.resolve(__dirname, '../../fixtures/save.tractor.conf.js'), fileStructure);
        await file.save('test');
        
        await timeout(1500);

        const response = await fetch(`http://localhost:${port}/search?searchString=save`, {
            method: 'GET'
        });
        const { count, results } = await response.json();

        expect(count).to.equal(1);

        const [testTractorConf] = results;
        expect(testTractorConf.basename).to.equal('save');
        expect(testTractorConf.extension).to.equal('.tractor.conf.js');
        expect(testTractorConf.url).to.equal('/save.tractor.conf.js');

        await file.delete();
        await close();
    });
    
    it('should return only return one result per File, even if it has been saved multiple times', async () => {
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        class TractorConfigFile extends File { }
        TractorConfigFile.prototype.extension = '.tractor.conf.js';

        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
        fileStructure.addFileType(TractorConfigFile);
        await fileStructure.read();
        const file = new TractorConfigFile(path.resolve(__dirname, '../../fixtures/save.tractor.conf.js'), fileStructure);
        await file.save('test');
        await file.save('test');
        
        await timeout(1500);

        const response = await fetch(`http://localhost:${port}/search?searchString=save`, {
            method: 'GET'
        });
        const { count } = await response.json();

        expect(count).to.equal(1);

        await file.delete();
        await close();
    });

    it('should reindex whenever a File is deleted', async () => {
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        class TractorConfigFile extends File { }
        TractorConfigFile.prototype.extension = '.tractor.conf.js';

        const fileStructure = new FileStructure(path.resolve(__dirname, '../../fixtures'));
        fileStructure.addFileType(TractorConfigFile);
        await fileStructure.read();
        const file = new TractorConfigFile(path.resolve(__dirname, '../../fixtures/save.tractor.conf.js'), fileStructure);
        await file.save('test');
        await file.delete({ 
            isCopy: false,
            isMove: false
        });
        
        await timeout(1500);

        const response = await fetch(`http://localhost:${port}/search?searchString=save`, {
            method: 'GET'
        });
        const { count } = await response.json();

        expect(count).to.equal(0);

        await close();
    });
});
