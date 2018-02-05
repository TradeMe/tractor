/* global describe:true, it:true, xit:true */

// Constants:
const MAGIC_TIMEOUT_NUMBER = 10;

// Test setup:
import { expect, Promise, sinon } from 'tractor-unit-test';

// Dependencies:
import childProcess from 'child_process';
import { EventEmitter } from 'events';
import path from 'path';
import { TractorError } from 'tractor-error-handler';
import * as tractorLogger from 'tractor-logger';

// Under test:
import { run } from './protractor-runner';

describe('server/sockets: protractor-runner:', () => {
    it('should run protractor', () => {
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

        return running.then(() => {
            let protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
            let protractorConfigPath = path.join('tractor', 'protractor.conf.js');
            let specs = path.join(config.directory, '/features/**/*.feature');
            expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfigPath, '--baseUrl', 'baseUrl', '--specs', specs, '--params.debug', false]);
        })
        .finally(() => {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        });
    });

    it('should run protractor for a single feature', () => {
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
            feature: 'feature'
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        return running.then(() => {
            let protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
            let protractorConfPath = path.join('tractor', 'protractor.conf.js');
            let specs = path.join(config.directory, '/features/**/feature.feature');
            expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfPath, '--baseUrl', 'baseUrl', '--specs', specs, '--params.debug', false]);
        })
        .finally(() => {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        });
    });

    it('should run protractor for features that match a tag', () => {
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
            tag: '@tag'
        };

        let running = run(config, socket, options);
        setTimeout(() => {
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        return running.then(() => {
            let protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
            let protractorConfPath = path.join('tractor', 'protractor.conf.js');
            let specs = path.join(config.directory, '/features/**/*.feature');
            expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfPath, '--baseUrl', 'baseUrl', '--specs', specs, '--params.debug', false, '--cucumberOpts.tags', '@tag']);
        })
        .finally(() => {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        });
    });

    xit('should throw if `baseUrl` is not defined:', () => {
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

        return run(config, socket, options)
        .then(() => {
            expect(Promise.reject).to.have.been.calledWith(new TractorError('`baseUrl` must be defined.'));
        })
        .finally(() => {
            Promise.reject.restore();
            tractorLogger.info.restore();
        });
    });

    xit('should throw if protractor is already running', () => {
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
        run().catch(() => {
            setTimeout(() => {
                spawnEmitter.emit('exit', 0);
            }, MAGIC_TIMEOUT_NUMBER);
        });

        return running.then(() => {
            expect(Promise.reject).to.have.been.calledWith(new TractorError('Protractor already running.'));
        })
        .finally(() => {
            childProcess.spawn.restore();
            Promise.reject.restore();
            tractorLogger.info.restore();
        });
    });

    it('should disconnect the socket when protractor finishes', () => {
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

        return running.then(() => {
            expect(socket.disconnect).to.have.been.calledOnce();
        })
        .finally(() => {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        });
    });

    it('should log any errors that occur while running protractor', () => {
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

        return running.then(() => {
            expect(tractorLogger.error).to.have.been.calledOnce();
        })
        .finally(() => {
            childProcess.spawn.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });

    it('should log any errors that cause protractor to exit with a bad error code', () => {
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

        return running.then(() => {
            expect(tractorLogger.error).to.have.been.calledOnce();
        })
        .finally(() => {
            childProcess.spawn.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });

    it('should send messages from stdout to the client', () => {
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

        return running.then(() => {
            expect(socket.emit).to.have.been.calledWith('protractor-out', 'Scenario');
        })
        .finally(() => {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        });
    });

    it('should send messages from stderr to the client', () => {
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

        return running.then(() => {
            expect(socket.emit).to.have.been.calledWith('protractor-out', 'error');
        })
        .finally(() => {
            childProcess.spawn.restore();
            tractorLogger.info.restore();
        });
    });
});
