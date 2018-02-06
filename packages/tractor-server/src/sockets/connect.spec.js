/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { EventEmitter } from 'events';
import * as protractorRunner from './protractor-runner';

// Under test:
import { socketHandler } from './connect';

describe('server/sockets: connect:', () => {
    it(`should run protractor when a 'run' event is recieved:`, () => {
        let config = {};
        let socket = new EventEmitter();

        sinon.stub(protractorRunner, 'run');

        socketHandler(config)(socket);
        socket.emit('run');

        expect(protractorRunner.run).to.have.been.called.with(config, socket);

        protractorRunner.run.restore();
    });
});
