// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import path from 'path';
import * as tractorLogger from '@tractor/logger';

// Under test:
import { getConfig, loadConfig } from './index';

describe('@tractor/config-loader:', () => {
    describe('getConfig:', () => {
        it('should re-use the config if it has already been loaded', () => {
            sinon.stub(tractorLogger, 'info');

            let config1 = getConfig();
            let config2 = getConfig();

            expect(config1).to.equal(config2);

            tractorLogger.info.restore();
        });
    });

    describe('loadConfig:', () => {
        it('should use the passed in path to load the config', () => {
            sinon.stub(process, 'cwd').returns('.');
            sinon.spy(path, 'resolve');
            sinon.stub(tractorLogger, 'info');

            loadConfig('./my.conf.js');

            expect(path.resolve).to.have.been.calledWith('.', './my.conf.js');

            process.cwd.restore();
            path.resolve.restore();
            tractorLogger.info.restore();
        });

        it('should fall back to looking from "./tractor.conf.js"', () => {
            sinon.stub(process, 'cwd').returns('.');
            sinon.spy(path, 'resolve');
            sinon.stub(tractorLogger, 'info');

            loadConfig();

            expect(path.resolve).to.have.been.calledWith('.', 'tractor.conf.js');

            process.cwd.restore();
            path.resolve.restore();
            tractorLogger.info.restore();
        });

        it('should load config values from a file', () => {
            sinon.stub(tractorLogger, 'info');

            let config = loadConfig(path.resolve(__dirname, '../fixtures/test.conf.js'));

            expect(config.port).to.equal(5000);
            expect(config.directory).to.equal('./tests/e2e');

            tractorLogger.info.restore();
        });

        it('should load config values from an ES2015 module', () => {
            sinon.stub(tractorLogger, 'info');

            let config = loadConfig(path.resolve(__dirname, '../fixtures/test.esm.conf.js'));

            expect(config.port).to.equal(5000);
            expect(config.directory).to.equal('./tests/e2e');

            tractorLogger.info.restore();
        });

        it('should load any missing values from the default config', () => {
            sinon.stub(tractorLogger, 'info');

            let config = loadConfig(path.resolve(__dirname, '../fixtures/empty.conf.js'));

            expect(config.port).to.equal(4000);
            expect(config.directory).to.equal('./tractor');
            expect(config.environments).to.deep.equal(['http://localhost:8080']);

            tractorLogger.info.restore();
        });
    });
});
