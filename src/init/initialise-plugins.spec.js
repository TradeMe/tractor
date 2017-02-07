/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import * as tractorLogger from 'tractor-logger';
import tractorPluginLoader from 'tractor-plugin-loader';

// Under test:
import { initialisePlugins } from './initialise-plugins';

describe('tractor - init/initialise-plugins:', () => {
    it('should initialise all the installed plugins', () => {
        let plugin = {
            init: () => {}
        };
        let plugins = [plugin];

        sinon.stub(plugin, 'init');
        sinon.stub(tractorPluginLoader, 'getPlugins').returns(plugins);
        sinon.stub(tractorLogger, 'info');

        return initialisePlugins()
        .then(() => {
            expect(plugin.init).to.have.been.called();
        })
        .finally(() => {
            tractorLogger.info.restore();
            tractorPluginLoader.getPlugins.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        let plugin = {
            init: () => {},
            name: 'test-plugin'
        };
        let plugins = [plugin];

        sinon.stub(plugin, 'init');
        sinon.stub(tractorPluginLoader, 'getPlugins').returns(plugins);
        sinon.stub(tractorLogger, 'info');

        return initialisePlugins()
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Initialising test-plugin');
        })
        .finally(() => {
            tractorLogger.info.restore();
            tractorPluginLoader.getPlugins.restore();
        });
    });
});
