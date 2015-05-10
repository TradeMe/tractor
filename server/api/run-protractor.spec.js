/* global describe:true, it: true */
'use strict';

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var noop = require('node-noop').noop;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var runProtractor = require('./run-protractor');

describe('server/api: run-protractor:', function () {
    // it('should run "protractor"', function () {
    //     var childProcess = require('child_process');
    //     var EventEmitter = require('events').EventEmitter;
    //     var log = require('../utils/logging');
    //     var path = require('path');
    //
    //     var spawnEmitter = new EventEmitter();
    //     spawnEmitter.stdout = new EventEmitter();
    //     spawnEmitter.stdout.pipe = noop;
    //     spawnEmitter.stderr = new EventEmitter();
    //     spawnEmitter.stderr.pipe = noop;
    //     var socket = {
    //         disconnect: noop
    //     };
    //
    //     sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
    //     sinon.stub(log, 'important');
    //     sinon.stub(log, 'info');
    //     sinon.stub(log, 'success');
    //
    //     var run = runProtractor(socket);
    //
    //     setTimeout(function () {
    //         spawnEmitter.emit('exit', 0);
    //     }, 10);
    //
    //     return run.finally(function () {
    //         var protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
    //         var protractorConfPath = path.join('e2e_tests', 'protractor.conf.js');
    //         expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfPath]);
    //
    //         childProcess.spawn.restore();
    //         log.important.restore();
    //         log.info.restore();
    //         log.success.restore();
    //     });
    // });
    //
    // it('shouldn\'t run "protractor" if it is already running', function () {
    //     var EventEmitter = require('events').EventEmitter;
    //     var childProcess = require('child_process');
    //     var log = require('../utils/logging');
    //
    //     var spawnEmitter = new EventEmitter();
    //     spawnEmitter.stdout = new EventEmitter();
    //     spawnEmitter.stdout.pipe = noop;
    //     spawnEmitter.stderr = new EventEmitter();
    //     spawnEmitter.stderr.pipe = noop;
    //     var socket = {
    //         disconnect: noop
    //     };
    //
    //     sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
    //     sinon.stub(log, 'error');
    //     sinon.stub(log, 'important');
    //     sinon.stub(log, 'info');
    //     sinon.stub(log, 'success');
    //
    //     var run = runProtractor(socket);
    //     runProtractor().catch(function () {
    //         setTimeout(function () {
    //             spawnEmitter.emit('exit', 0);
    //         }, 10);
    //     });
    //
    //     return run.finally(function () {
    //         expect(log.error).to.have.been.calledWith('Protractor already running.');
    //
    //         childProcess.spawn.restore();
    //         log.error.restore();
    //         log.important.restore();
    //         log.info.restore();
    //         log.success.restore();
    //     });
    // });
    //
    // it('should disconnect the socket when "protractor" finishes', function () {
    //     var EventEmitter = require('events').EventEmitter;
    //     var childProcess = require('child_process');
    //     var log = require('../utils/logging');
    //
    //     var spawnEmitter = new EventEmitter();
    //     spawnEmitter.stdout = new EventEmitter();
    //     spawnEmitter.stdout.pipe = noop;
    //     spawnEmitter.stderr = new EventEmitter();
    //     spawnEmitter.stderr.pipe = noop;
    //
    //     sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
    //     sinon.stub(log, 'important');
    //     sinon.stub(log, 'info');
    //     sinon.stub(log, 'success');
    //
    //     var socket = {
    //         disconnect: noop
    //     };
    //     sinon.spy(socket, 'disconnect');
    //
    //     var run = runProtractor(socket);
    //     setTimeout(function () {
    //         spawnEmitter.emit('exit', 0);
    //     }, 10);
    //
    //     return run.then(function () {
    //         expect(socket.disconnect.callCount).to.equal(1);
    //
    //         childProcess.spawn.restore();
    //         log.important.restore();
    //         log.info.restore();
    //         log.success.restore();
    //     });
    // });
    //
    // it('should log any errors that occur while running "protractor"', function () {
    //     var EventEmitter = require('events').EventEmitter;
    //     var childProcess = require('child_process');
    //     var log = require('../utils/logging');
    //
    //     var spawnEmitter = new EventEmitter();
    //     spawnEmitter.stdout = new EventEmitter();
    //     spawnEmitter.stdout.pipe = noop;
    //     spawnEmitter.stderr = new EventEmitter();
    //     spawnEmitter.stderr.pipe = noop;
    //
    //     sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
    //     sinon.stub(log, 'error');
    //     sinon.stub(log, 'important');
    //     sinon.stub(log, 'info');
    //     sinon.stub(log, 'success');
    //     sinon.stub(log, 'warn');
    //
    //     var socket = {
    //         disconnect: noop,
    //         lastMessage: ''
    //     };
    //
    //     var run = runProtractor(socket);
    //     setTimeout(function () {
    //         spawnEmitter.emit('error', { message: 'error' });
    //     }, 10);
    //
    //     return run.then(function () {
    //         expect(log.error.callCount).to.equal(1);
    //
    //         childProcess.spawn.restore();
    //         log.error.restore();
    //         log.important.restore();
    //         log.info.restore();
    //         log.success.restore();
    //         log.warn.restore();
    //     });
    // });
    //
    // it('should log any errors that cause "protractor" to exit with a bad error code', function () {
    //     var EventEmitter = require('events').EventEmitter;
    //     var childProcess = require('child_process');
    //     var log = require('../utils/logging');
    //
    //     var spawnEmitter = new EventEmitter();
    //     spawnEmitter.stdout = new EventEmitter();
    //     spawnEmitter.stdout.pipe = noop;
    //     spawnEmitter.stderr = new EventEmitter();
    //     spawnEmitter.stderr.pipe = noop;
    //
    //     sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
    //     sinon.stub(log, 'error');
    //     sinon.stub(log, 'important');
    //     sinon.stub(log, 'info');
    //     sinon.stub(log, 'success');
    //
    //     var socket = {
    //         disconnect: noop,
    //         lastMessage: ''
    //     };
    //
    //     var run = runProtractor(socket);
    //     setTimeout(function () {
    //         spawnEmitter.emit('exit', 1);
    //     }, 10);
    //
    //     return run.then(function () {
    //         expect(log.error.callCount).to.equal(1);
    //
    //         childProcess.spawn.restore();
    //         log.error.restore();
    //         log.important.restore();
    //         log.info.restore();
    //         log.success.restore();
    //     });
    // });
    //
    // it('should format messages from "stdout" and send them to the client', function () {
    //     var EventEmitter = require('events').EventEmitter;
    //     var childProcess = require('child_process');
    //     var log = require('../utils/logging');
    //
    //     var spawnEmitter = new EventEmitter();
    //     spawnEmitter.stdout = new EventEmitter();
    //     spawnEmitter.stdout.pipe = noop;
    //     spawnEmitter.stderr = new EventEmitter();
    //     spawnEmitter.stderr.pipe = noop;
    //
    //     sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
    //     sinon.stub(log, 'important');
    //     sinon.stub(log, 'info');
    //     sinon.stub(log, 'success');
    //
    //     var socket = {
    //         emit: noop,
    //         disconnect: noop
    //     };
    //     sinon.spy(socket, 'emit');
    //
    //     var run = runProtractor(socket);
    //     setTimeout(function () {
    //         spawnEmitter.stdout.emit('data', 'Scenario');
    //         spawnEmitter.stdout.emit('data', 'Error:');
    //         spawnEmitter.emit('exit', 0);
    //     }, 10);
    //
    //     return run.then(function () {
    //         expect(socket.emit).to.have.been.calledWith('protractor-out', {
    //             message: 'Scenario',
    //             type: 'info'
    //         });
    //         expect(socket.emit).to.have.been.calledWith('protractor-out', {
    //             message: 'Error:',
    //             type: 'error'
    //         });
    //
    //         childProcess.spawn.restore();
    //         log.important.restore();
    //         log.info.restore();
    //         log.success.restore();
    //     });
    // });
    //
    // it('should format messages from "stderr" and send them to the client', function () {
    //     var EventEmitter = require('events').EventEmitter;
    //     var childProcess = require('child_process');
    //     var log = require('../utils/logging');
    //
    //     var spawnEmitter = new EventEmitter();
    //     spawnEmitter.stdout = new EventEmitter();
    //     spawnEmitter.stdout.pipe = noop;
    //     spawnEmitter.stderr = new EventEmitter();
    //     spawnEmitter.stderr.pipe = noop;
    //
    //     sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
    //     sinon.stub(log, 'important');
    //     sinon.stub(log, 'info');
    //     sinon.stub(log, 'success');
    //
    //     var socket = {
    //         emit: noop,
    //         disconnect: noop
    //     };
    //     sinon.spy(socket, 'emit');
    //
    //     var run = runProtractor(socket);
    //     setTimeout(function () {
    //         spawnEmitter.stderr.emit('data', 'error');
    //         spawnEmitter.emit('exit', 0);
    //     }, 10);
    //
    //     return run.then(function () {
    //         expect(socket.emit).to.have.been.calledWith('protractor-err', {
    //             message: 'Something went really wrong - check the console for details.',
    //             type: 'error'
    //         });
    //
    //         childProcess.spawn.restore();
    //         log.important.restore();
    //         log.info.restore();
    //         log.success.restore();
    //     });
    // });
    //
    // it('should not send irrelevant messages to the client', function () {
    //     var EventEmitter = require('events').EventEmitter;
    //     var childProcess = require('child_process');
    //     var log = require('../utils/logging');
    //
    //     var spawnEmitter = new EventEmitter();
    //     spawnEmitter.stdout = new EventEmitter();
    //     spawnEmitter.stdout.pipe = noop;
    //     spawnEmitter.stderr = new EventEmitter();
    //     spawnEmitter.stderr.pipe = noop;
    //
    //     sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
    //     sinon.stub(log, 'important');
    //     sinon.stub(log, 'info');
    //     sinon.stub(log, 'success');
    //
    //     var socket = {
    //         emit: noop,
    //         disconnect: noop
    //     };
    //     sinon.spy(socket, 'emit');
    //
    //     var run = runProtractor(socket);
    //     setTimeout(function () {
    //         spawnEmitter.stdout.emit('data', '');
    //         spawnEmitter.stdout.emit('data', 'something irrelevant');
    //         spawnEmitter.emit('exit', 0);
    //     }, 10);
    //
    //     return run.then(function () {
    //         expect(socket.emit.callCount).to.equal(0);
    //
    //         childProcess.spawn.restore();
    //         log.important.restore();
    //         log.info.restore();
    //         log.success.restore();
    //     });
    // });
});
