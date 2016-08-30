/* global describe:true, it:true */
'use strict';

// Constants:
import config from '../config/config';
const MAGIC_TIMEOUT_NUMBER = 10;

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import childProcess from 'child_process';
import { EventEmitter } from 'events';
import log from 'npmlog';
import path from 'path';

// Under test:
import * as protractorRunner from './protractor-runner';

describe('server/sockets: protractor-runner:', () => {
    it('should run "protractor"', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            disconnect: _.noop
        };

        let specs = path.join(config.testDirectory, '/features/**/*.feature');

        let runOptions = {
            baseUrl: "baseUrl"
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        let run = protractorRunner.run(socket, runOptions);
        setTimeout(() => {
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        return run.then(() => {
            let protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
            let protractorConfPath = path.join('e2e-tests', 'protractor.conf.js');
            expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfPath, '--baseUrl', 'baseUrl', '--specs', specs]);
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should run "protractor" for single feature', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            disconnect: _.noop
        };

        let runOptions = {
            baseUrl: "baseUrl",
            feature: "feature"
        };

        let specs = path.join(config.testDirectory, '/features/**/feature.feature');

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        let run = protractorRunner.run(socket, runOptions);
        setTimeout(() => {
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        return run.then(() => {
            let protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
            let protractorConfPath = path.join('e2e-tests', 'protractor.conf.js');
            expect(childProcess.spawn).to.have.been.calledWith('node', [protractorPath, protractorConfPath, '--baseUrl', 'baseUrl', '--specs', specs]);
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should throw an `Error` if `baseUrl` is not defined:', () => {
        let runOptions = {};
        let socket = {
            disconnect: _.noop
        };

        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'error');
        sinon.stub(log, 'info');

        return protractorRunner.run(socket, runOptions)
        .then(() => {
            expect(log.error).to.have.been.calledWith('`baseUrl` must be defined.');
        })
        .finally(() => {
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.error.restore();
            log.info.restore();
        });
    });

    it('should throw an `Error` on single feature run, if `feature` is not defined:', () => {
        let feature;
        let runOptions = {
            baseUrl: "baseUrl",
            feature
        };
        let socket = {
            disconnect: _.noop
        };

        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'error');
        sinon.stub(log, 'info');

        return protractorRunner.run(socket, runOptions)
        .then(() => {
            expect(log.error).to.have.been.calledWith('to run a single feature, `feature` must be defined.');
        })
        .finally(() => {
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.error.restore();
            log.info.restore();
        });
    });

    it('shouldn\'t run "protractor" if it is already running', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            disconnect: _.noop
        };
        let runOptions = {
            baseUrl: 'baseUrl'
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'info');
        sinon.stub(log, 'error');
        sinon.stub(log, 'verbose');

        let run = protractorRunner.run(socket, runOptions);
        protractorRunner.run().catch(() => {
            setTimeout(() => {
                spawnEmitter.emit('exit', 0);
            }, MAGIC_TIMEOUT_NUMBER);
        });

        return run.then(() => {
            expect(log.error).to.have.been.calledWith('Protractor already running.');
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.info.restore();
            log.error.restore();
            log.verbose.restore();
        });
    });

    it('should disconnect the socket when "protractor" finishes', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            disconnect: _.noop
        };
        let runOptions = {
            baseUrl: 'baseUrl'
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');
        sinon.spy(socket, 'disconnect');

        let run = protractorRunner.run(socket, runOptions);
        setTimeout(() => {
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        return run.then(() => {
            expect(socket.disconnect).to.have.been.calledOnce();
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should log any errors that occur while running "protractor"', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            disconnect: _.noop,
            lastMessage: ''
        };
        let runOptions = {
            baseUrl: 'baseUrl'
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'info');
        sinon.stub(log, 'error');
        sinon.stub(log, 'verbose');
        sinon.stub(log, 'warn');

        let run = protractorRunner.run(socket, runOptions);
        setTimeout(() => {
            spawnEmitter.emit('error', { message: 'error' });
        }, MAGIC_TIMEOUT_NUMBER);

        return run.then(() => {
            expect(log.error).to.have.been.calledOnce();
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.info.restore();
            log.error.restore();
            log.verbose.restore();
            log.warn.restore();
        });
    });

    it('should log any errors that cause "protractor" to exit with a bad error code', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            disconnect: _.noop,
            lastMessage: ''
        };
        let runOptions = {
            baseUrl: 'baseUrl'
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'error');
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        let run = protractorRunner.run(socket, runOptions);
        setTimeout(() => {
            spawnEmitter.emit('exit', 1);
        }, MAGIC_TIMEOUT_NUMBER);

        return run.then(() => {
            expect(log.error).to.have.been.calledOnce();
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.error.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should format messages from "stdout" and send them to the client', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            emit: _.noop,
            disconnect: _.noop
        };
        let runOptions = {
            baseUrl: 'baseUrl'
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');
        sinon.spy(socket, 'emit');

        let run = protractorRunner.run(socket, runOptions);
        setTimeout(() => {
            spawnEmitter.stdout.emit('data', 'Scenario');
            spawnEmitter.stdout.emit('data', 'Error:');
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        return run.then(() => {
            expect(socket.emit).to.have.been.calledWith('protractor-out', {
                message: 'Scenario',
                type: 'info'
            });
            expect(socket.emit).to.have.been.calledWith('protractor-out', {
                message: 'Error:',
                type: 'error'
            });
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should format messages from "stderr" and send them to the client', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            emit: _.noop,
            disconnect: _.noop
        };
        let runOptions = {
            baseUrl: 'baseUrl'
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');
        sinon.spy(socket, 'emit');

        let run = protractorRunner.run(socket, runOptions);
        setTimeout(() => {
            spawnEmitter.stderr.emit('data', 'error');
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        return run.then(() => {
            expect(socket.emit).to.have.been.calledWith('protractor-err', {
                message: 'Something went really wrong - check the console for details.',
                type: 'error'
            });
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should not send irrelevant messages to the client', () => {
        let spawnEmitter = new EventEmitter();
        spawnEmitter.stdout = new EventEmitter();
        spawnEmitter.stdout.pipe = _.noop;
        spawnEmitter.stderr = new EventEmitter();
        spawnEmitter.stderr.pipe = _.noop;
        let socket = {
            emit: _.noop,
            disconnect: _.noop
        };
        let runOptions = {
            baseUrl: 'baseUrl'
        };

        sinon.stub(childProcess, 'spawn').returns(spawnEmitter);
        sinon.stub(config, 'beforeProtractor');
        sinon.stub(config, 'afterProtractor');
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');
        sinon.spy(socket, 'emit');

        let run = protractorRunner.run(socket, runOptions);
        setTimeout(() => {
            spawnEmitter.stdout.emit('data', '');
            spawnEmitter.stdout.emit('data', 'something irrelevant');
            spawnEmitter.emit('exit', 0);
        }, MAGIC_TIMEOUT_NUMBER);

        return run.then(() => {
            expect(socket.emit).to.not.have.been.called();
        })
        .finally(() => {
            childProcess.spawn.restore();
            config.beforeProtractor.restore();
            config.afterProtractor.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });
});
