/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP, Promise, sinon } from 'tractor-unit-test';

// Dependencies:
import * as tractorLogger from 'tractor-logger';

// Under test:
import { initialisePlugins } from './initialise-plugins';

describe('tractor - initialise-plugins:', () => {
    it('should initialise all the installed plugins', () => {
        let di = ineeda({
            call: () => Promise.resolve()
        });
        let plugin = ineeda({
            init: NOOP
        });
        let plugins = [plugin];

        sinon.stub(tractorLogger, 'info');

        return initialisePlugins(di, plugins)
        .then(() => {
            expect(di.call).to.have.been.calledWith(plugin.init);
        })
        .finally(() => {
            tractorLogger.info.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        let di = ineeda({
            call: () => Promise.resolve()
        });
        let plugin = ineeda({
            init: () => {},
            name: 'test-plugin'
        });
        let plugins = [plugin];

        sinon.stub(tractorLogger, 'info');

        return initialisePlugins(di, plugins)
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Initialising tractor-plugin-test-plugin...');
        })
        .finally(() => {
            tractorLogger.info.restore();
        });
    });
});
