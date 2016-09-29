/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import commander from 'commander';
import path from 'path';

// Under test:
import tractorConfigLoader from './index';

describe('tractor-config-loader: loadConfig:', () => {
    it('should parse the argv to find a config file path', () => {
        sinon.spy(commander, 'option');
        sinon.spy(commander, 'parse');

        tractorConfigLoader.loadConfig();

        expect(commander.option).to.have.been.calledWith('-c, --config <path>');
        expect(commander.parse).to.have.been.calledWith(process.argv);

        commander.option.restore();
        commander.parse.restore();
        delete commander.config;
    });

    it('should use the value from argv to load the config', () => {
        process.argv.push('--config');
        process.argv.push('./my.conf.js');
        sinon.stub(process, 'cwd').returns('.');
        sinon.spy(path, 'resolve');

        tractorConfigLoader.loadConfig();

        expect(path.resolve).to.have.been.calledWith('.', './my.conf.js');

        process.argv.pop();
        process.argv.pop();
        process.cwd.restore();
        path.resolve.restore();
        delete commander.config;
    });

    it('should fall back to looking from "./tractor.conf.js"', () => {
        sinon.stub(process, 'cwd').returns('.');
        sinon.spy(path, 'resolve');

        tractorConfigLoader.loadConfig();

        expect(path.resolve).to.have.been.calledWith('.', 'tractor.conf.js');

        process.cwd.restore();
        path.resolve.restore();
        delete commander.config;
    });

    it('should load config values from a file', () => {
        process.argv.push('--config');
        process.argv.push('./assets/test.conf.js');

        let config = tractorConfigLoader.loadConfig();

        expect(config.port).to.equal(5000);
        expect(config.testDirectory).to.equal('./tests/e2e');

        process.argv.pop();
        process.argv.pop();
        delete commander.config;
    });

    it('should load config values from an ES2015 module', () => {
        process.argv.push('--config');
        process.argv.push('./assets/test.esm.conf.js');

        let config = tractorConfigLoader.loadConfig();

        expect(config.port).to.equal(5000);
        expect(config.testDirectory).to.equal('./tests/e2e');

        process.argv.pop();
        process.argv.pop();
        delete commander.config;
    });

    it('should load any missing values from the default config', () => {
        let config = tractorConfigLoader.loadConfig();

        expect(config.port).to.equal(4000);
        expect(config.testDirectory).to.equal('./e2e-tests');
        expect(config.environments).to.deep.equal(['http://localhost:8080']);
    });
});
