/* global describe:true, it:true */

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Under test:
import create from './create';

describe('tractor-plugin-browser - create:', () => {
    it('should return the `browser`', () => {
        let browser = {};

        let plugin = create(browser);
        expect(plugin).to.equal(browser);
    })
});
