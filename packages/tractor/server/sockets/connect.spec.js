/* global describe:true, beforeEach:true, afterEach:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var connect;

// Mocks:
var protractorRunnerMock = require('./protractor-runner.mock');
var revert;

describe('server/sockets: connect:', function () {
    beforeEach(function () {
        connect = rewire('./connect');
        /* eslint-disable no-underscore-dangle */
        revert = connect.__set__({
            protractorRunner: protractorRunnerMock
        });
        /* eslint-enable no-underscore-dangle */
    });

    afterEach(function () {
        revert();
    });

    it('should run "Protractor" when a "run" event is recieved:', function () {
        var EventEmitter = require('events').EventEmitter;
        var socket = new EventEmitter();

        sinon.stub(protractorRunnerMock, 'run');

        connect(socket);
        socket.emit('run');

        expect(protractorRunnerMock.run).to.have.been.called();

        protractorRunnerMock.run.restore();
    });
});
