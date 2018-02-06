/* global describe:true, it:true */

// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import Promise from 'bluebird';
import { upgradePlugins } from './upgrade-plugins';

// Under test:
import { upgrade } from './index';

describe('tractor - upgrade:', () => {
    it('should run the upgrade process', () => {
        let di = ineeda({
            call: () => Promise.resolve()
        });

        return upgrade(di)
        .then(() => {
            expect(di.call).to.have.been.calledWith(upgradePlugins);
        });
    });
});
