// Test setup:
import { getPort, expect } from '@tractor/unit-test';

// Dependencies:
import fetch from 'node-fetch';

// Under test:
import { startTestServer } from '../../test/test-server';

describe('@tractor/server - api: get-plugins', () => {
    it('should respond with the descriptions of all installed plugins', async () => {
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        const response = await fetch(`http://localhost:${port}/plugins`, {
            method: 'GET'
        });
        const [browser] = await response.json();

        expect(browser.name).to.deep.equal('Browser');
        expect(browser.variableName).to.equal('browser');
        expect(browser.hasUI).to.equal(false);

        await close();
    });
});
