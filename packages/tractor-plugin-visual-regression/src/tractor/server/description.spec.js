/* global describe:true, it:true */

// Test setup:
import { expect } from '../../../test-setup';

// Under test:
import { description } from './description';

describe('tractor-plugin-visual-regression - description:', () => {
    it('should have the `ignoreElement` action', () => {
        let ignoreElement = description.actions.find(action => action.name === 'ignore element');
        expect(ignoreElement).to.not.be.undefined();
    });

    it('should have the `includeElement` action', () => {
        let includeElement = description.actions.find(action => action.name === 'include element');
        expect(includeElement).to.not.be.undefined();
    });

    it('should have the `takeScreenshot` action', () => {
        let takeScreenshot = description.actions.find(action => action.name === 'take screenshot');
        expect(takeScreenshot).to.not.be.undefined();
    });
});
