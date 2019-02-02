// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as tractorLogger from '@tractor/logger';
import * as findUp from 'find-up';
import * as path from 'path';

// Under test:
import { loadPlugins } from './index';

describe('@tractor/plugin-loader:', () => {
    describe('loadPlugins():', () => {
        it('should do nothing if there is not any installed plugins', () => {
            sinon.stub(tractorLogger, 'info');

            const plugins = loadPlugins({ cwd: path.parse(__dirname).root });

            expect(plugins.length).to.equal(0);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should load all available plugins', () => {
            sinon.stub(tractorLogger, 'info');

            // NOTE -
            // Stub `findUp.sync` so that the test doesn't keep search up
            // through to the real node_modules directory. We just want it
            // to look through the modules in the fixture.
            const findUpSync = sinon.stub(findUp, 'sync');
            findUpSync.onSecondCall().returns(null);
            findUpSync.callThrough();

            const plugins = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic')
            });

            const expectedLength = 2;
            expect(plugins.length).to.equal(expectedLength);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should create a plugin for each installed plugin', function (): void {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(plugin.fullName).to.equal('@tractor-plugins/test-plugin');
            expect(plugin.name).to.equal('test-plugin');

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should create a plugin for an ES2015 module', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/esm'),
                plugins: ['test-plugin']
            });

            expect(plugin.fullName).to.equal('@tractor-plugins/test-plugin');
            expect(plugin.name).to.equal('test-plugin');

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should throw if the plugin cannot be loaded', () => {
            sinon.stub(tractorLogger, 'info');

            expect(() => {
                loadPlugins({
                    cwd: path.resolve(__dirname, '../fixtures/broken'),
                    plugins: ['test-plugin']
                });
            }).to.throw(TractorError, `could not require '@tractor-plugins/test-plugin'`);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should decorate the `description` with display values', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(plugin.description.name).to.equal('Test Plugin');
            expect(plugin.description.variableName).to.equal('testPlugin');
            expect(plugin.description.url).to.equal('test-plugin');

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should not overwrite an existing `description`', () => {
            // HACK:
            // Manually require the plugin fixture to validate plugin loading:
            // tslint:disable-next-line:no-require-imports
            const requiredPlugin = require('../fixtures/complex/node_modules/@tractor-plugins/test-plugin/dist');

            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/complex'),
                plugins: ['test-plugin']
            });

            expect(plugin.description).to.equal(requiredPlugin.description);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should decorate the `description` with the version', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(plugin.description.version).to.equal('1.0.0');

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should have a default `create` function that is a noop', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(() => {
                plugin.create();
            }).to.not.throw();

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should not overwrite an existing `create` function', () => {
            // HACK:
            // Manually require the plugin fixture to validate plugin loading:
            // tslint:disable-next-line:no-require-imports
            const requiredPlugin = require('../fixtures/complex/node_modules/@tractor-plugins/test-plugin/dist');

            sinon.stub(requiredPlugin, 'create');
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/complex'),
                plugins: ['test-plugin']
            });
            plugin.create();

            expect(requiredPlugin.create.callCount > 0).to.equal(true);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should have a default `init` function that is a noop', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(() => {
                plugin.init();
            }).to.not.throw();

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should not overwrite an existing `init` function', () => {
            // HACK:
            // Manually require the plugin fixture to validate plugin loading:
            // tslint:disable-next-line:no-require-imports
            const requiredPlugin = require('../fixtures/complex/node_modules/@tractor-plugins/test-plugin/dist');

            sinon.stub(requiredPlugin, 'init');
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/complex'),
                plugins: ['test-plugin']
            });
            plugin.init();

            expect(requiredPlugin.init.callCount > 0).to.equal(true);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should have a default `plugin` function that is a noop', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(() => {
                plugin.plugin({});
            }).to.not.throw();

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should not overwrite an existing `plugin` function', () => {
            // HACK:
            // Manually require the plugin fixture to validate plugin loading:
            // tslint:disable-next-line:no-require-imports
            const requiredPlugin = require('../fixtures/complex/node_modules/@tractor-plugins/test-plugin/dist');

            sinon.stub(requiredPlugin, 'plugin');
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/complex'),
                plugins: ['test-plugin']
            });
            plugin.plugin({});

            expect(requiredPlugin.plugin.callCount > 0).to.equal(true);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should have a default `run` function that is a noop', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(() => {
                plugin.run();
            }).to.not.throw();

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should not overwrite an existing `run` function', () => {
            // HACK:
            // Manually require the plugin fixture to validate plugin loading:
            // tslint:disable-next-line:no-require-imports
            const requiredPlugin = require('../fixtures/complex/node_modules/@tractor-plugins/test-plugin/dist');

            sinon.stub(requiredPlugin, 'run');
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/complex'),
                plugins: ['test-plugin']
            });
            plugin.run();

            expect(requiredPlugin.run.callCount > 0).to.equal(true);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should have a default `serve` function that is a noop', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(() => {
                plugin.serve();
            }).to.not.throw();

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should not overwrite an existing `serve` function', () => {
            // HACK:
            // Manually require the plugin fixture to validate plugin loading:
            // tslint:disable-next-line:no-require-imports
            const requiredPlugin = require('../fixtures/complex/node_modules/@tractor-plugins/test-plugin/dist');

            sinon.stub(requiredPlugin, 'serve');
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/complex'),
                plugins: ['test-plugin']
            });
            plugin.serve();

            expect(requiredPlugin.serve.callCount > 0).to.equal(true);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should have a default `upgrade` function that is a noop', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(() => {
                plugin.upgrade();
            }).to.not.throw();

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should not overwrite an existing `upgrade` function', () => {
            // HACK:
            // Manually require the plugin fixture to validate plugin loading:
            // tslint:disable-next-line:no-require-imports
            const requiredPlugin = require('../fixtures/complex/node_modules/@tractor-plugins/test-plugin/dist');

            sinon.stub(requiredPlugin, 'upgrade');
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/complex'),
                plugins: ['test-plugin']
            });
            plugin.upgrade();

            expect(requiredPlugin.upgrade.callCount > 0).to.equal(true);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to true if it works', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/complex'),
                plugins: ['test-plugin']
            });

            const expectedScriptPath = path.join('@tractor-plugins', 'test-plugin', 'dist', 'client', 'bundle.js');
            expect(plugin.script && plugin.script.includes(expectedScriptPath)).to.equal(true);
            expect(plugin.description.hasUI).to.equal(true);

            (tractorLogger.info as sinon.SinonStub).restore();
        });

        it('should try to load the UI bundle and set the `hasUI` flag to false if it fails', () => {
            sinon.stub(tractorLogger, 'info');

            const [plugin] = loadPlugins({
                cwd: path.resolve(__dirname, '../fixtures/basic'),
                plugins: ['test-plugin']
            });

            expect(plugin.description.hasUI).to.equal(false);

            (tractorLogger.info as sinon.SinonStub).restore();
        });
    });
});
