/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import fs from 'fs';
import module from 'module';
import path from 'path';
import * as tractorLogger from 'tractor-logger';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { loadPlugins } from './load-plugins';

describe('tractor-plugin-loader:', () => {
    describe('load-plugins:', () => {
        it('should do nothing if there is not any installed plugins', () => {
            let nodeModules = [];

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(0);

            fs.readdirSync.restore();
            tractorLogger.info.restore();
        });

        it('should create a plugin for each installed plugin', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(1);
            expect(pluginModule.fullName).to.equal('tractor-plugin-test');
            expect(pluginModule.name).to.equal('test');

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should create a plugin for an ES2015 module', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {
                default: {}
            };

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(1);

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should throw if the plugin cannot be loaded', () => {
            let nodeModules = ['tractor-plugin-test'];

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').throws(new Error());
            sinon.stub(tractorLogger, 'info');

            expect(() => {
                loadPlugins();
            }).to.throw(TractorError, `could not require 'tractor-plugin-test'`);

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should decorate the `description` with display values', () => {
            let nodeModules = ['tractor-plugin-test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.description.name).to.equal('Test Plugin');
            expect(test.description.variableName).to.equal('testPlugin');
            expect(test.description.url).to.equal('test-plugin');

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `create` function that is a noop', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.create();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `init` function that is a noop', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.init();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `plugin` function that is a noop', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.plugin();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `run` function that is a noop', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.run();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `serve` function that is a noop', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.serve();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to true if it works', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {};

            sinon.stub(fs, 'accessSync').returns(true);
            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.script).to.equal(path.join('node_modules', 'tractor-plugin-test', 'dist', 'client', 'bundle.js'));
            expect(test.description.hasUI).to.equal(true);

            fs.accessSync.restore();
            fs.readdirSync.restore();
            module._load.restore();
            process.cwd.restore();
            tractorLogger.info.restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to false if it fails', () => {
            let nodeModules = ['tractor-plugin-test'];
            let pluginModule = {};

            sinon.stub(fs, 'accessSync').throws(new Error());
            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.description.hasUI).to.equal(false);

            fs.accessSync.restore();
            fs.readdirSync.restore();
            module._load.restore();
            process.cwd.restore();
            tractorLogger.info.restore();
        });
    });
});
