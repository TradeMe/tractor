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
