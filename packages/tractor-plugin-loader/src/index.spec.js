/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import * as loadPlugins from './load-plugins';

// Under test:
import { getPlugins, getPluginDescriptions } from './index';

describe('tractor-plugin-loader:', () => {
    describe('getPlugins:', () => {
        it('should only run the plugin search one time', () => {
            sinon.stub(loadPlugins, 'loadPlugins').returns({});

            let plugins1 = getPlugins();
            let plugins2 = getPlugins();

            expect(plugins1).to.equal(plugins2);

            loadPlugins.loadPlugins.restore();
            Object.defineProperty(getPlugins, 'plugins', { value: null, configurable: true });
        });
    });

    describe('getPluginDescriptions:', () => {
        it('should return the description for each loaded plugin', () => {
            let description = {};
            let pluginModule = {
                description
            };

            sinon.stub(loadPlugins, 'loadPlugins').returns([pluginModule]);

            let descriptions = getPluginDescriptions();

            expect(descriptions.length).to.equal(1);
            let [test] = descriptions;
            expect(test).to.equal(description);

            loadPlugins.loadPlugins.restore();
            Object.defineProperty(getPlugins, 'plugins', { value: null, configurable: true });
        });
    });
});
