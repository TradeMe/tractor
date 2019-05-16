// Test setup:
import { getPort, expect } from '@tractor/unit-test';

// Dependencies:
import * as socket from 'socket.io-client';

// Under test:
import { startTestServer } from '../../test/test-server';

describe('@tractor/server - api: run-protractor:', () => {
    it(`should run protractor when a 'run' event is recieved:`, async () => {
        jest.setTimeout(20000);
        const port = await getPort();
        const close = await startTestServer('test.tractor.conf.js', port);

        const connection = socket.connect(`http://localhost:${port}/run-protractor`, {
            forceNew: true
        });

        const run = await new Promise((resolve): void => {
            connection.on('connect', () => {
                connection.emit('run');
            });
            connection.on('disconnect', () => {
                resolve(true);
            });
        });

        expect(run).to.equal(true);

        await close();
    });

    // TODO:
    // Write these tests:

    it.skip('should run protractor with any given options', async () => { });

    it.skip('should throw if `baseUrl` is not defined', async () => { });

    it.skip('should throw if protractor is already running', async () => { });

    it.skip('should disconnect the socket when protractor finishes', async () => { });

    it.skip('should log any errors that occur while running protractor', async () => { });

    it.skip('should log any errors that cause protractor to exit with a bad error code', async () => { });

    it.skip('should send messages from stdout to the client', async () => { });

    it.skip('should send messages from stderr to the client', async () => { });
});
