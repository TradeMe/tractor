/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import { EventEmitter } from 'events';
import * as protractorRunner from './protractor-runner';

// Under test:
import connect from './connect';

describe('server/sockets: connect:', () => {
    it('should run "Protractor" when a "run" event is recieved:', () => {
        let socket = new EventEmitter();

        sinon.stub(protractorRunner, 'run');

        connect(socket);
        socket.emit('run');

        expect(protractorRunner.run).to.have.been.called();

        protractorRunner.run.restore();
    });
});
