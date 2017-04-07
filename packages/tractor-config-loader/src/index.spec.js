/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import path from 'path';

// Under test:
import { getConfig, loadConfig } from './index';

describe('tractor-config-loader:', () => {
    describe('getConfig:', () => {
        it('should re-use the config if it has already been loaded', () => {
            let config1 = getConfig();
            let config2 = getConfig();

            expect(config1).to.equal(config2);
        });
    });

    describe('loadConfig:', () => {
        it('should use the value from argv to load the config', () => {
            process.argv.push('--config');
            process.argv.push('./my.conf.js');
            sinon.stub(process, 'cwd').returns('.');
            sinon.spy(path, 'resolve');

            loadConfig();

            expect(path.resolve).to.have.been.calledWith('.', './my.conf.js');

            process.argv.pop();
            process.argv.pop();
            process.cwd.restore();
            path.resolve.restore();
        });

        it('should fall back to looking from "./tractor.conf.js"', () => {
            sinon.stub(process, 'cwd').returns('.');
            sinon.spy(path, 'resolve');

            loadConfig();

            expect(path.resolve).to.have.been.calledWith('.', 'tractor.conf.js');

            process.cwd.restore();
            path.resolve.restore();
        });

        it('should load config values from a file', () => {
            process.argv.push('--config');
            process.argv.push('./assets/test.conf.js');

            let config = loadConfig();

            expect(config.port).to.equal(5000);
            expect(config.directory).to.equal('./tests/e2e');

            process.argv.pop();
            process.argv.pop();
        });

        it('should load config values from an ES2015 module', () => {
            process.argv.push('--config');
            process.argv.push('./assets/test.esm.conf.js');

            let config = loadConfig();

            expect(config.port).to.equal(5000);
            expect(config.directory).to.equal('./tests/e2e');

            process.argv.pop();
            process.argv.pop();
        });

        it('should load any missing values from the default config', () => {
            let config = loadConfig();

            expect(config.port).to.equal(4000);
            expect(config.directory).to.equal('./tractor');
            expect(config.environments).to.deep.equal(['http://localhost:8080']);
            expect(config.tags).to.deep.equal([]);
        });
    });
});
