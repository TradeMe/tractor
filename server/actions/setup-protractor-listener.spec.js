/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var setupProtractorListener = require('./setup-protractor-listener');

describe('server/actions: setup-protractor-listener:', function () {
    it('should listen to sockets in the "/run-protractor" namespace for a "connection" event', function () {
        var EventEmitter = require('events').EventEmitter;
        var emitter = new EventEmitter();
        var sockets = {
            of: noop
        };
        sinon.stub(sockets, 'of').returns(emitter);
        sinon.spy(emitter, 'on');

        setupProtractorListener(sockets);

        expect(sockets.of).to.have.been.calledWith('/run-protractor');
        expect(emitter.on).to.have.been.calledWith('connection');
    });

    describe('"run-protractor" listener: ', function () {
        it('should spawn the "protractor" command when it receives a "connection" event', function () {
            var EventEmitter = require('events').EventEmitter;
            var childProcess = require('child_process');
			var path = require('path');
            var socketEmitter = new EventEmitter();
            var spawnEmitter = new EventEmitter();
            spawnEmitter.stdout = new EventEmitter();
            spawnEmitter.stderr = new EventEmitter();
            var sockets = {
                of: noop
            };
            sinon.stub(sockets, 'of').returns(socketEmitter);
            sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
            setupProtractorListener(sockets);

            socketEmitter.emit('connection');

			var protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
			var protractorConfPath = path.join('e2e_tests', 'protractor.conf.js');
            expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfPath]);

            childProcess.spawn.restore();
        });

        it('should disconnect the socket when "protractor" finishes', function () {
            var EventEmitter = require('events').EventEmitter;
            var childProcess = require('child_process');
            var socketEmitter = new EventEmitter();
            var spawnEmitter = new EventEmitter();
            spawnEmitter.stdout = new EventEmitter();
            spawnEmitter.stderr = new EventEmitter();
            var sockets = {
                of: noop
            };
            sinon.stub(sockets, 'of').returns(socketEmitter);
            sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
            setupProtractorListener(sockets);
            var socket = {
                disconnect: noop
            };
            sinon.spy(socket, 'disconnect');

            socketEmitter.emit('connection', socket);
            spawnEmitter.emit('exit');

            expect(socket.disconnect.callCount).to.equal(1);

            childProcess.spawn.restore();
        });

        it('should format messages from "stdout" and send them to the client', function () {
            var log = require('../utils/logging');
            var EventEmitter = require('events').EventEmitter;
            var childProcess = require('child_process');
            var socketEmitter = new EventEmitter();
            var spawnEmitter = new EventEmitter();
            spawnEmitter.stdout = new EventEmitter();
            spawnEmitter.stderr = new EventEmitter();
            var sockets = {
                of: noop
            };
            sinon.stub(sockets, 'of').returns(socketEmitter);
            sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
            sinon.stub(log, 'info');
            setupProtractorListener(sockets);
            var socket = {
                emit: noop
            };
            sinon.spy(socket, 'emit');

            socketEmitter.emit('connection', socket);

            spawnEmitter.stdout.emit('data', '  output[0m');

            expect(socket.emit).to.have.been.calledWith('protractor-out', 'output');

            childProcess.spawn.restore();
            log.info.restore();
        });

        it('should format messages from "stdout" and send them to the client', function () {
            var log = require('../utils/logging');
            var EventEmitter = require('events').EventEmitter;
            var childProcess = require('child_process');
            var socketEmitter = new EventEmitter();
            var spawnEmitter = new EventEmitter();
            spawnEmitter.stdout = new EventEmitter();
            spawnEmitter.stderr = new EventEmitter();
            var sockets = {
                of: noop
            };
            sinon.stub(sockets, 'of').returns(socketEmitter);
            sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
            sinon.stub(log, 'error');
            setupProtractorListener(sockets);
            var socket = {
                emit: noop
            };
            sinon.spy(socket, 'emit');

            socketEmitter.emit('connection', socket);

            spawnEmitter.stderr.emit('data', '  error  ');

            expect(socket.emit).to.have.been.calledWith('protractor-err', 'error');

            childProcess.spawn.restore();
            log.error.restore();
        });

        it('should not send empty messages to the client', function () {
            var EventEmitter = require('events').EventEmitter;
            var childProcess = require('child_process');
            var socketEmitter = new EventEmitter();
            var spawnEmitter = new EventEmitter();
            spawnEmitter.stdout = new EventEmitter();
            spawnEmitter.stderr = new EventEmitter();
            var sockets = {
                of: noop
            };
            sinon.stub(sockets, 'of').returns(socketEmitter);
            sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
            setupProtractorListener(sockets);
            var socket = {
                emit: noop
            };
            sinon.spy(socket, 'emit');

            socketEmitter.emit('connection', socket);

            spawnEmitter.stderr.emit('data', '');
            spawnEmitter.stdout.emit('data', '');

            expect(socket.emit.callCount).to.equal(0);

            childProcess.spawn.restore();
        });
    });
});
