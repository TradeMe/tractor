// Test setup:
import { expect, NOOP, sinon } from '@tractor/unit-test';

// Dependencies:
import fs from 'fs';
import module from 'module';
import path from 'path';
import * as tractorLogger from '@tractor/logger';
import { TractorError } from '@tractor/error-handler';

// Under test:
import { loadPlugins } from './load-plugins';

describe('@tractor/plugin-loader:', () => {
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
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(1);
            expect(pluginModule.fullName).to.equal('@tractor-plugins/test-plugin');
            expect(pluginModule.name).to.equal('test-plugin');

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should create a plugin for an ES2015 module', () => {
            let nodeModules = ['test-plugin'];
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
            let nodeModules = ['test-plugin'];

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').throws(new Error());
            sinon.stub(tractorLogger, 'info');

            expect(() => {
                loadPlugins();
            }).to.throw(TractorError, `could not require '@tractor-plugins/test-plugin'`);

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should decorate the `description` with display values', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;

            expect(testPlugin.description.name).to.equal('Test Plugin');
            expect(testPlugin.description.variableName).to.equal('testPlugin');
            expect(testPlugin.description.url).to.equal('test-plugin');

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should not overwrite an existing `description`', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {
                description: {}
            };

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;

            expect(testPlugin.description).to.equal(pluginModule.description);

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should decorate the `description` with the version', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};
            let pluginPackage = {
                version: '0.1.0'
            };

            sinon.stub(process, 'cwd').returns('');
            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load')
                .withArgs('node_modules/@tractor-plugins/test-plugin').returns(pluginModule)
                .withArgs('node_modules/@tractor-plugins/test-plugin/package.json').returns(pluginPackage);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;

            expect(testPlugin.description.version).to.equal('0.1.0');

            process.cwd.restore();
            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `create` function that is a noop', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            expect(() => {
                testPlugin.create();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should not overwrite an existing `create` function', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {
                create: NOOP
            };

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(pluginModule, 'create');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            testPlugin.create();

            expect(pluginModule.create).to.have.been.called();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `init` function that is a noop', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            expect(() => {
                testPlugin.init();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should not overwrite an existing `init` function', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {
                init: NOOP
            };

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(pluginModule, 'init');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            testPlugin.init();

            expect(pluginModule.init).to.have.been.called();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `plugin` function that is a noop', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            expect(() => {
                testPlugin.plugin();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should not overwrite an existing `plugin` function', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {
                plugin: NOOP
            };

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(pluginModule, 'plugin');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            testPlugin.plugin();

            expect(pluginModule.plugin).to.have.been.called();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `run` function that is a noop', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            expect(() => {
                testPlugin.run();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should not overwrite an existing `run` function', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {
                run: NOOP
            };

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(pluginModule, 'run');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            testPlugin.run();

            expect(pluginModule.run).to.have.been.called();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `serve` function that is a noop', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            expect(() => {
                testPlugin.serve();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should not overwrite an existing `serve` function', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {
                serve: NOOP
            };

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(pluginModule, 'serve');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            testPlugin.serve();

            expect(pluginModule.serve).to.have.been.called();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `upgrade` function that is a noop', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            expect(() => {
                testPlugin.upgrade();
            }).to.not.throw();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should not overwrite an existing `upgrade` function', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {
                upgrade: NOOP
            };

            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(pluginModule, 'upgrade');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;
            testPlugin.upgrade();

            expect(pluginModule.upgrade).to.have.been.called();

            fs.readdirSync.restore();
            module._load.restore();
            tractorLogger.info.restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to true if it works', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'accessSync').returns(true);
            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;

            expect(testPlugin.script).to.equal(path.join('node_modules', '@tractor-plugins', 'test-plugin', 'dist', 'client', 'bundle.js'));
            expect(testPlugin.description.hasUI).to.equal(true);

            fs.accessSync.restore();
            fs.readdirSync.restore();
            module._load.restore();
            process.cwd.restore();
            tractorLogger.info.restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to false if it fails', () => {
            let nodeModules = ['test-plugin'];
            let pluginModule = {};

            sinon.stub(fs, 'accessSync').throws(new Error());
            sinon.stub(fs, 'readdirSync').returns(nodeModules);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [testPlugin] = plugins;

            expect(testPlugin.description.hasUI).to.equal(false);

            fs.accessSync.restore();
            fs.readdirSync.restore();
            module._load.restore();
            process.cwd.restore();
            tractorLogger.info.restore();
        });
    });
});
