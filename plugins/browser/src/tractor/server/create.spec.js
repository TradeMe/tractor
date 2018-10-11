// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { create } from './create';

describe('@tractor-plugins/browser - create:', () => {
    it('should return the `browser`', () => {
        let browser = {};

        let plugin = create(browser);
        expect(plugin).to.equal(browser);
    });
});
