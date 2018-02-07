/* global describe:true, it:true */

// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { create } from './create';

describe('tractor-plugin-browser - create:', () => {
    it('should return the `browser`', () => {
        let browser = {};

        let plugin = create(browser);
        expect(plugin).to.equal(browser);
    })
});
