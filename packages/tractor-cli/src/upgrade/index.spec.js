// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import { upgradePlugins } from './upgrade-plugins';

// Under test:
import { upgrade } from './index';

describe('tractor - upgrade:', () => {
    it('should run the upgrade process', async () => {
        let di = ineeda({
            call: () => Promise.resolve()
        });

        await upgrade(di);
        expect(di.call).to.have.been.calledWith(upgradePlugins);
    });
});
