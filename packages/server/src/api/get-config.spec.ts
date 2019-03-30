// Test setup:
import { getPort, expect } from '@tractor/unit-test';

// Dependencies:
import fetch from 'node-fetch';

// Under test:
import { startTestServer } from '../../test/test-server';

describe('@tractor/server - api: get-config:', () => {
    it('should respond with the current config', async () => {
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        const response = await fetch(`http://localhost:${port}/config`, {
            method: 'GET'
        });
        const data = await response.json();

        expect(data.plugins).to.deep.equal(['browser']);
        expect(data.port).to.equal(port);

        await close();
    });
});
