/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from 'tractor-unit-test';

// Dependencies:
import * as loadPlugins from './load-plugins';

// Under test:
import { getPlugins } from './index';

describe('tractor-plugin-loader:', () => {
    describe('getPlugins:', () => {
        it('should only run the plugin search one time', () => {
            sinon.stub(loadPlugins, 'loadPlugins').returns({});

            let plugins1 = getPlugins();
            let plugins2 = getPlugins();

            expect(plugins1).to.equal(plugins2);

            loadPlugins.loadPlugins.restore();
        });
    });
});
