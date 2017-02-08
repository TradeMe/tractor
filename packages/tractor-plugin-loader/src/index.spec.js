/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import childProcess from 'child_process';
import fs from 'fs';
import module from 'module';
import os from 'os';
import path from 'path';
import * as tractorConfigLoader from 'tractor-config-loader';
import { TractorError } from 'tractor-error-handler';

// Under test:
import tractorPluginLoader from './index';

describe('tractor-plugin-loader:', () => {
    describe('tractor-plugin-loader: getPlugins:', () => {
        it('should query npm from any installed plugins', () => {
            let npmLsResult = {
                stderr: '',
                stdout: ''
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            tractorPluginLoader.getPlugins();

            expect(childProcess.spawnSync).to.have.been.calledWith('npm');

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should use npm.cmd on Windows', () => {
            let npmLsResult = {
                stderr: '',
                stdout: ''
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(os, 'platform').returns('win32');

            tractorPluginLoader.getPlugins();

            expect(childProcess.spawnSync).to.have.been.calledWith('npm.cmd');

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            os.platform.restore();
        });

        it('should do nothing if there is not any installed plugins', () => {
            let npmLsResult = {
                stderr: '',
                stdout: ''
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins = tractorPluginLoader.getPlugins();

            expect(plugins.length).to.equal(0);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should only run the plugin search one time', () => {
            let npmLsResult = {
                stderr: '',
                stdout: ''
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins1 = tractorPluginLoader.getPlugins();
            let plugins2 = tractorPluginLoader.getPlugins();

            expect(plugins1).to.equal(plugins2);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should ignore any errors thrown by extraneous dependencies', () => {
            let npmLsResult = {
                stderr: 'npm ERR! extraneous',
                stdout: ''
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins = tractorPluginLoader.getPlugins();

            expect(plugins.length).to.equal(0);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should ignore any errors thrown by invalid dependencies', () => {
            let npmLsResult = {
                stderr: 'npm ERR! invalid',
                stdout: ''
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins = tractorPluginLoader.getPlugins();

            expect(plugins.length).to.equal(0);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should ignore any errors thrown by missing peer dependencies', () => {
            let npmLsResult = {
                stderr: 'npm ERR! peer dep missing',
                stdout: ''
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins = tractorPluginLoader.getPlugins();

            expect(plugins.length).to.equal(0);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should throw when it encounters an unexpected error', () => {
            let npmLsResult = {
                stderr: 'uh oh!',
                stdout: ''
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            expect(() => {
                tractorPluginLoader.getPlugins();
            }).to.throw(TractorError, 'uh oh!');

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should create a plugin for each installed plugin', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {},
                create: () => {}
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = tractorPluginLoader.getPlugins();

            expect(plugins.length).to.equal(1);
            expect(pluginModule.fullName).to.equal('tractor-plugin-test');
            expect(pluginModule.name).to.equal('test');

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should create a plugin for an ES2015 module', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                default: {
                    description: {},
                    create: () => {}
                }
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = tractorPluginLoader.getPlugins();

            expect(plugins.length).to.equal(1);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should throw if the plugin cannot be loaded', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').throws(new Error());

            expect(() => {
                tractorPluginLoader.getPlugins();
            }).to.throw(TractorError, `could not require 'tractor-plugin-test'`);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should throw if the plugin has no `description`', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {};

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            expect(() => {
                tractorPluginLoader.getPlugins();
            }).to.throw(TractorError, `'tractor-plugin-test' has no \`description\``);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should throw if the plugin has no `create` function', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            expect(() => {
                tractorPluginLoader.getPlugins();
            }).to.throw(TractorError, `'tractor-plugin-test' has no \`create\` function`);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should decorate the `description` with display values', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test-plugin'
            };
            let pluginModule = {
                description: {},
                create: () => {}
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;

            expect(test.description.name).to.equal('Test plugin');
            expect(test.description.variableName).to.equal('testPlugin');
            expect(test.description.url).to.equal('test-plugin');

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should decorate the `addHooks` function so that it takes the current config', () => {
            let config = {};
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let addHooks = () => {};
            let pluginModule = {
                description: {},
                addHooks,
                create: () => {}
            };
            let cucumber = {};

            sinon.stub(tractorConfigLoader, 'getConfig').returns(config);
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);
            let addHooksStub = sinon.stub(pluginModule, 'addHooks');

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;
            test.addHooks(cucumber);

            expect(addHooksStub).to.have.been.calledWith(cucumber, config);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should have a default `addHooks` function that is a noop', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {},
                create: () => {},
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;
            expect(() => {
                test.addHooks();
            }).to.not.throw();

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should decorate the `create` function so that it takes the current config', () => {
            let config = {};
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let create = () => {};
            let pluginModule = {
                description: {},
                create
            };
            let browser = {};

            sinon.stub(tractorConfigLoader, 'getConfig').returns(config);
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);
            let createStub = sinon.stub(pluginModule, 'create');

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;
            test.create(browser);

            expect(createStub).to.have.been.calledWith(browser, config);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should decorate the `serve` function so that it takes the current config', () => {
            let config = {};
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let serve = () => {}
            let pluginModule = {
                description: {},
                create: () => {},
                serve
            };
            let application = {}
            let sockets = {};

            sinon.stub(tractorConfigLoader, 'getConfig').returns(config);
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);
            let serveStub = sinon.stub(pluginModule, 'serve');

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;
            test.serve(application, sockets);

            expect(serveStub).to.have.been.calledWith(application, sockets, config);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should have a default `serve` function that is a noop', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {},
                create: () => {},
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;
            expect(() => {
                test.serve();
            }).to.not.throw();

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should decorate the `init` function so that it takes the current config', () => {
            let config = {};
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let init = () => {}
            let pluginModule = {
                description: {},
                create: () => {},
                init
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns(config);
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);
            let initStub = sinon.stub(pluginModule, 'init');

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;
            test.init();

            expect(initStub).to.have.been.calledWith(config);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should have a default `init` function that is a noop', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {},
                create: () => {},
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;
            expect(() => {
                test.init();
            }).to.not.throw();

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should try to load the UI bundle and set the `hasUI` flag to true if it works', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {},
                create: () => {}
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(fs, 'accessSync').returns(true);

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;

            expect(test.script).to.equal(path.join('node_modules', 'tractor-plugin-test', 'dist', 'client', 'bundle.js'));
            expect(test.description.hasUI).to.equal(true);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            process.cwd.restore();
            fs.accessSync.restore();
            tractorPluginLoader._plugins = null;
        });

        it('should try to load the UI bundle and set the `hasUI` flag to false if it fails', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {},
                create: () => {}
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(fs, 'accessSync').throws(new Error());

            let plugins = tractorPluginLoader.getPlugins();
            let [test] = plugins;

            expect(test.description.hasUI).to.equal(false);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            process.cwd.restore();
            fs.accessSync.restore();
            tractorPluginLoader._plugins = null;
        });
    });

    describe('tractor-plugin-loader: getPluginDescriptions:', () => {
        it('should return the description for each loaded plugin', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let description = {};
            let pluginModule = {
                description,
                create: () => {}
            };

            sinon.stub(tractorConfigLoader, 'getConfig').returns({});
            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let descriptions = tractorPluginLoader.getPluginDescriptions();

            expect(descriptions.length).to.equal(1);
            let [test] = descriptions;
            expect(test).to.equal(description);

            tractorConfigLoader.getConfig.restore();
            childProcess.spawnSync.restore();
            module._load.restore();
            tractorPluginLoader._plugins = null;
        });
    });
});
