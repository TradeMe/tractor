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
import readPkgUp from 'read-pkg-up';
import * as tractorLogger from 'tractor-logger';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { loadPlugins } from './load-plugins';

describe('tractor-plugin-loader:', () => {
    describe('load-plugins:', () => {
        it('should do nothing if there is not any installed plugins', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {}
            };

            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(0);

            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should create a plugin for each installed plugin', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(1);
            expect(pluginModule.fullName).to.equal('tractor-plugin-test');
            expect(pluginModule.name).to.equal('test');

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should create a plugin for an ES2015 module', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {
                default: {
                    description: {}
                }
            };

            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();

            expect(plugins.length).to.equal(1);

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should throw if the plugin cannot be loaded', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };

            sinon.stub(module, '_load').throws(new Error());
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            expect(() => {
                loadPlugins();
            }).to.throw(TractorError, `could not require 'tractor-plugin-test'`);

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should throw if the plugin has no `description`', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {};

            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            expect(() => {
                loadPlugins();
            }).to.throw(TractorError, `'tractor-plugin-test' has no \`description\``);

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should decorate the `description` with display values', () => {
            let pkg = {
                dependencies: {
                    'tractor-plugin-test-plugin': '1.0.0'
                },
                devDependencies: {}
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.description.name).to.equal('Test Plugin');
            expect(test.description.variableName).to.equal('testPlugin');
            expect(test.description.url).to.equal('test-plugin');

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `addHooks` function that is a noop', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.addHooks();
            }).to.not.throw();

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `create` function that is a noop', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.create();
            }).to.not.throw();

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `serve` function that is a noop', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {
                description: {},
            };

            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.serve();
            }).to.not.throw();

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should have a default `init` function that is a noop', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {
                description: {},
            };

            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;
            expect(() => {
                test.init();
            }).to.not.throw();

            module._load.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to true if it works', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(fs, 'accessSync').returns(true);
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.script).to.equal(path.join('node_modules', 'tractor-plugin-test', 'dist', 'client', 'bundle.js'));
            expect(test.description.hasUI).to.equal(true);

            fs.accessSync.restore();
            module._load.restore();
            process.cwd.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to false if it fails', () => {
            let pkg = {
                dependencies: {},
                devDependencies: {
                    'tractor-plugin-test': '1.0.0'
                }
            };
            let pluginModule = {
                description: {}
            };

            sinon.stub(fs, 'accessSync').throws(new Error());
            sinon.stub(module, '_load').returns(pluginModule);
            sinon.stub(process, 'cwd').returns('.');
            sinon.stub(readPkgUp, 'sync').returns({ pkg });
            sinon.stub(tractorLogger, 'info');

            let plugins = loadPlugins();
            let [test] = plugins;

            expect(test.description.hasUI).to.equal(false);

            fs.accessSync.restore();
            module._load.restore();
            process.cwd.restore();
            readPkgUp.sync.restore();
            tractorLogger.info.restore();
        });
    });
});
