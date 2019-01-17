// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import path from 'path';
import * as tractorLogger from '@tractor/logger';

// Under test:
import { loadConfig } from './index';

describe('@tractor/config-loader:', () => {
    describe('loadConfig():', () => {
        it('should use the passed in path to load the config', () => {
            sinon.spy(path, 'resolve');
            sinon.stub(tractorLogger, 'info');

            loadConfig(process.cwd(), './my.conf.js');

            expect(path.resolve).to.have.been.calledWith(process.cwd(), './my.conf.js');

            path.resolve.restore();
            tractorLogger.info.restore();
        });

        it('should fall back to looking from "./tractor.conf.js"', () => {
            sinon.spy(path, 'resolve');
            sinon.stub(tractorLogger, 'info');

            loadConfig(process.cwd());

            expect(path.resolve).to.have.been.calledWith(process.cwd(), 'tractor.conf.js');

            path.resolve.restore();
            tractorLogger.info.restore();
        });

        it('should load config values from a file', () => {
            sinon.stub(tractorLogger, 'info');

            const config = loadConfig(__dirname, '../fixtures/test.conf.js');

            expect(config.port).to.equal(5000);
            expect(config.directory).to.equal('./tests/e2e');

            tractorLogger.info.restore();
        });

        it('should load config values from an ES2015 module', () => {
            sinon.stub(tractorLogger, 'info');

            const config = loadConfig(__dirname, '../fixtures/test.esm.conf.js');

            expect(config.port).to.equal(5000);
            expect(config.directory).to.equal('./tests/e2e');

            tractorLogger.info.restore();
        });

        it('should load any missing values from the default config', () => {
            sinon.stub(tractorLogger, 'info');

            const config = loadConfig(__dirname, '../fixtures/empty.conf.js');

            expect(config.port).to.equal(4000);
            expect(config.directory).to.equal('./tractor');
            expect(config.environments).to.deep.equal(['http://localhost:8080']);

            tractorLogger.info.restore();
        });
    });
});
