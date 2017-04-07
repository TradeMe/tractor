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
import { TractorError } from 'tractor-error-handler';

// Under test:
import { loadPlugins } from './load-plugins';

describe('tractor-plugin-loader:', () => {
    describe('load-plugins:', () => {
        it('should query npm from any installed plugins', () => {
            let npmLsResult = {
                stderr: '',
                stdout: ''
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            loadPlugins();

            expect(childProcess.spawnSync).to.have.been.calledWith('npm');

            childProcess.spawnSync.restore();
        });

        it('should use npm.cmd on Windows', () => {
            let npmLsResult = {
                stderr: '',
                stdout: ''
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(os, 'platform').returns('win32');

            loadPlugins();

            expect(childProcess.spawnSync).to.have.been.calledWith('npm.cmd');

            childProcess.spawnSync.restore();
            os.platform.restore();
        });

        it('should do nothing if there is not any installed plugins', () => {
            let npmLsResult = {
                stderr: '',
                stdout: ''
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(0);

            childProcess.spawnSync.restore();
        });

        it('should ignore any errors thrown by extraneous dependencies', () => {
            let npmLsResult = {
                stderr: 'npm ERR! extraneous',
                stdout: ''
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(0);

            childProcess.spawnSync.restore();
        });

        it('should ignore any errors thrown by invalid dependencies', () => {
            let npmLsResult = {
                stderr: 'npm ERR! invalid',
                stdout: ''
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(0);

            childProcess.spawnSync.restore();
        });

        it('should ignore any errors thrown by missing peer dependencies', () => {
            let npmLsResult = {
                stderr: 'npm ERR! peer dep missing',
                stdout: ''
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(0);

            childProcess.spawnSync.restore();
        });

        it('should throw when it encounters an unexpected error', () => {
            let npmLsResult = {
                stderr: 'uh oh!',
                stdout: ''
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);

            expect(() => {
                loadPlugins();
            }).to.throw(TractorError, 'uh oh!');

            childProcess.spawnSync.restore();
        });

        it('should create a plugin for each installed plugin', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(1);
            expect(pluginModule.fullName).to.equal('tractor-plugin-test');
            expect(pluginModule.name).to.equal('test');

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        it('should create a plugin for an ES2015 module', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                default: {
                    description: {}
                }
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(1);

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        it('should throw if the plugin cannot be loaded', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').throws(new Error());

            expect(() => {
                loadPlugins();
            }).to.throw(TractorError, `could not require 'tractor-plugin-test'`);

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        it('should throw if the plugin has no `description`', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {};

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            expect(() => {
                loadPlugins();
            }).to.throw(TractorError, `'tractor-plugin-test' has no \`description\``);

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        it('should decorate the `description` with display values', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test-plugin'
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.description.name).to.equal('Test Plugin');
            expect(test.description.variableName).to.equal('testPlugin');
            expect(test.description.url).to.equal('test-plugin');

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        // it('should decorate the `addHooks` function so that it takes the current config', () => {
        //     let config = {};
        //     let npmLsResult = {
        //         stderr: '',
        //         stdout: 'tractor-plugin-test'
        //     };
        //     let addHooks = () => {};
        //     let pluginModule = {
        //         description: {},
        //         addHooks
        //     };
        //     let browser = {};
        //     let cucumber = {};
        //
        //     sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
        //     sinon.stub(module, '_load').returns(pluginModule);
        //     let addHooksStub = sinon.stub(pluginModule, 'addHooks');
        //
        //     let plugins = loadPlugins(config);
        //     let [test] = plugins;
        //     test.addHooks(browser, cucumber);
        //
        //     expect(addHooksStub).to.have.been.calledWith(browser, cucumber, config);
        //
        //     childProcess.spawnSync.restore();
        //     module._load.restore();
        // });

        it('should have a default `addHooks` function that is a noop', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.addHooks();
            }).to.not.throw();

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        // it('should decorate the `create` function so that it takes the current config', () => {
        //     let config = {};
        //     let npmLsResult = {
        //         stderr: '',
        //         stdout: 'tractor-plugin-test'
        //     };
        //     let create = () => {};
        //     let pluginModule = {
        //         description: {},
        //         create
        //     };
        //     let browser = {};
        //
        //     sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
        //     sinon.stub(module, '_load').returns(pluginModule);
        //     let createStub = sinon.stub(pluginModule, 'create');
        //
        //     let plugins = loadPlugins(config);
        //     let [test] = plugins;
        //     test.create(browser);
        //
        //     expect(createStub).to.have.been.calledWith(browser, config);
        //
        //     childProcess.spawnSync.restore();
        //     module._load.restore();
        // });

        it('should have a default `create` function that is a noop', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.create();
            }).to.not.throw();

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        // it('should decorate the `serve` function so that it takes the current config', () => {
        //     let config = {};
        //     let npmLsResult = {
        //         stderr: '',
        //         stdout: 'tractor-plugin-test'
        //     };
        //     let serve = () => {}
        //     let pluginModule = {
        //         description: {},
        //         serve
        //     };
        //     let application = {}
        //     let sockets = {};
        //
        //     sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
        //     sinon.stub(module, '_load').returns(pluginModule);
        //     let serveStub = sinon.stub(pluginModule, 'serve');
        //
        //     let plugins = loadPlugins();
        //     let [test] = plugins;
        //     test.serve(application, sockets);
        //
        //     expect(serveStub).to.have.been.calledWith(application, sockets, config);
        //
        //     childProcess.spawnSync.restore();
        //     module._load.restore();
        // });

        it('should have a default `serve` function that is a noop', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {},
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.serve();
            }).to.not.throw();

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        // it('should decorate the `init` function so that it takes the current config', () => {
        //     let config = {};
        //     let npmLsResult = {
        //         stderr: '',
        //         stdout: 'tractor-plugin-test'
        //     };
        //     let init = () => {}
        //     let pluginModule = {
        //         description: {},
        //         init
        //     };
        //
        //     sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
        //     sinon.stub(module, '_load').returns(pluginModule);
        //     let initStub = sinon.stub(pluginModule, 'init');
        //
        //     let plugins = loadPlugins(config);
        //     let [test] = plugins;
        //     test.init();
        //
        //     expect(initStub).to.have.been.calledWith(config);
        //
        //     childProcess.spawnSync.restore();
        //     module._load.restore();
        // });

        it('should have a default `init` function that is a noop', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {},
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.init();
            }).to.not.throw();

            childProcess.spawnSync.restore();
            module._load.restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to true if it works', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(fs, 'accessSync').returns(true);

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.script).to.equal(path.join('node_modules', 'tractor-plugin-test', 'dist', 'client', 'bundle.js'));
            expect(test.description.hasUI).to.equal(true);

            childProcess.spawnSync.restore();
            module._load.restore();
            process.cwd.restore();
            fs.accessSync.restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to false if it fails', () => {
            let npmLsResult = {
                stderr: '',
                stdout: 'tractor-plugin-test'
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(childProcess, 'spawnSync').returns(npmLsResult);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(fs, 'accessSync').throws(new Error());

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.description.hasUI).to.equal(false);

            childProcess.spawnSync.restore();
            module._load.restore();
            process.cwd.restore();
            fs.accessSync.restore();
        });
    });
});
