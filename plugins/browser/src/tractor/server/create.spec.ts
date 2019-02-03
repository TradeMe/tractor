// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import { TractorBrowser } from '../../tractor-browser';

// Under test:
import { create } from './create';

describe('@tractor-plugins/browser - create:', () => {
    it('should return the `browser`', () => {
        const browser = ineeda<TractorBrowser>();

        const plugin = create(browser);
        expect(plugin).to.equal(browser);
    });
});
