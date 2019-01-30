// Constants:
const MAGIC_TIMEOUT_NUMBER = 10;

// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import childProcess from 'child_process';
import { EventEmitter } from 'events';
import path from 'path';
import { TractorError } from '@tractor/error-handler';
import * as tractorLogger from '@tractor/logger';

// Under test:
import { run } from './protractor-runner';

describe('@tractor/server - sockets: protractor-runner:', () => {
    it.skip('should run protractor', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = () => {};
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = () => {};
        let socket = {
            disconnect: () => {}
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(tractorLogger, 'info');

        let options = {
            baseUrl: 'baseUrl'
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        try {
            await running;
            let protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
            let protractorConfigPath = path.join('tractor', 'protractor.conf.js');
            let specs = path.join(config.directory, '/features/**/*.feature');
            expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfigPath, '--baseUrl', 'baseUrl', '--specs', specs, '--params.debug', false]);
        } finally {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        }
    });

    it.skip('should run protractor with any given options', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = () => {};
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = () => {};

        let socket = {
            disconnect: () => {}
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(tractorLogger, 'info');

        let options = {
            baseUrl: 'baseUrl',
            params: {
                debug: false,
                tag: '#tag'
            }
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        try {
            await running;
            let protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
            let protractorConfPath = path.join('tractor', 'protractor.conf.js');
            expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfPath, '--baseUrl', 'baseUrl', '--params.debug', false, '--params.tags', '#tag']);
        } finally  {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        }
    });

    it.skip('should throw if `baseUrl` is not defined:', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let socket = {
            disconnect: () => {}
        };

        sinon.stub(Promise, 'reject');
        sinon.stub(tractorLogger, 'info');

        let options = {};

        try {
            await run(config, socket, options);
            expect(Promise.reject).to.have.been.calledWith(new TractorError('`baseUrl` must be defined.'));
        } finally {
            Promise.reject.restore();
            tractorLogger.info.restore();
        }
    });

    it.skip('should throw if protractor is already running', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = () => {};
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = () => {};
        let socket = {
            disconnect: () => {}
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.spy(Promise, 'reject');
        sinon.stub(tractorLogger, 'info');

        let options = {
            baseUrl: 'baseUrl'
        };

        let running = run(config, socket, options);
        try {
            await run();
        } catch {
            setTimeout(() => {
                spawnEmitter.emit('exit', 0);
            }, MAGIC_TIMEOUT_NUMBER);
        }

        try {
            await running;
            expect(Promise.reject).to.have.been.calledWith(new TractorError('Protractor already running.'));
        } finally {
            childProcess.spawn.restore();
            Promise.reject.restore();
            tractorLogger.info.restore();
        }
    });

    it('should disconnect the socket when protractor finishes', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = () => {};
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = () => {};
        let socket = {
            disconnect: () => {}
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.spy(socket, 'disconnect');
        sinon.stub(tractorLogger, 'info');

        let options = {
            baseUrl: 'baseUrl'
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        try {
            await running;
            expect(socket.disconnect.callCount).to.equal(1);
        } finally {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        }
    });

    it('should log any errors that occur while running protractor', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = () => {};
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = () => {};
        let socket = {
            disconnect: () => {},
            lastMessage: ''
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        let options = {
            baseUrl: 'baseUrl'
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.emit('error', { message: 'error' });
        }, MAGIC_TIMEOUT_NUMBER);

        try {
            await running;
            expect(tractorLogger.error.callCount).to.equal(1);
        } finally {
            childProcess.spawn.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        }
    });

    it('should log any errors that cause protractor to exit with a bad error code', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = () => {};
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = () => {};
        let socket = {
            disconnect: () => {},
            lastMessage: ''
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        let options = {
            baseUrl: 'baseUrl'
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.emit('exit', 1);
        }, MAGIC_TIMEOUT_NUMBER);

        try {
            await running;
            expect(tractorLogger.error.callCount).to.equal(1);
        } finally {
            childProcess.spawn.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        }
    });

    it('should send messages from stdout to the client', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = () => {};
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = () => {};
        let socket = {
            emit: () => {},
            disconnect: () => {}
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.spy(socket, 'emit');
        sinon.stub(tractorLogger, 'info');

        let options = {
            baseUrl: 'baseUrl'
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.stdout.emit('data', 'Scenario');
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        try {
            await running;
            expect(socket.emit).to.have.been.calledWith('protractor-out', 'Scenario');
        } finally {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        }
    });

    it('should send messages from stderr to the client', async () => {
        let config = {
            directory: 'tractor',
            beforeProtractor: () => {},
            afterProtractor: () => {}
        };
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = () => {};
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = () => {};
        let socket = {
            emit: () => {},
            disconnect: () => {}
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.spy(socket, 'emit');
        sinon.stub(tractorLogger, 'info');

        let options = {
            baseUrl: 'baseUrl'
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.stderr.emit('data', 'error');
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        try {
            await running;
            expect(socket.emit).to.have.been.calledWith('protractor-out', 'error');
        } finally {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        }
    });
});
