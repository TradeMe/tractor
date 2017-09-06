/* global describe:true, it:true */

// Test setup:
import { expect, ineeda } from '../../test-setup';

// Under test:
import addHooks from './add-hooks';

describe('tractor-plugin-page-objects: add-hooks:', () => {
    it('should add "selectOptionText" to the ElementFinder prototype', () => {
        global.protractor = ineeda();
        global.protractor.ElementFinder.prototype.selectOptionText = null;

        addHooks();

        expect(global.protractor.ElementFinder.prototype.selectOptionText).to.not.equal(null);

        global.protractor = null;
    });

    it('should add "selectOptionIndex" to the ElementFinder prototype', () => {
        global.protractor = ineeda();
        global.protractor.ElementFinder.prototype.selectOptionIndex = null;

        addHooks();

        expect(global.protractor.ElementFinder.prototype.selectOptionIndex).to.not.equal(null);

        global.protractor = null;
    });

    // Pending: see https://github.com/phenomnomnominal/ineeda/issues/5
    describe('selectOptionText', () => {
        it('should look for all <option>s that match the given text');
        it('should should click the first option');
    });

    // Pending: see https://github.com/phenomnomnominal/ineeda/issues/5
    describe('selectOptionIndex', () => {
        it('should look for all <option>s');
        it('should should click the option at the given index');
    });
});
