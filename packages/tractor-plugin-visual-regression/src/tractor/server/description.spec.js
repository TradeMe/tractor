/* global describe:true, it:true */

// Test setup:
import { expect } from '../../../test-setup';

// Under test:
import { description } from './description';

describe('tractor-plugin-visual-regression - description:', () => {
    it('should have the `ignoreElement` method', () => {
        let ignoreElement = description.methods.find(method => method.name === 'ignoreElement');
        expect(ignoreElement).to.not.be.undefined();
    });

    it('should have the `includeElement` method', () => {
        let includeElement = description.methods.find(method => method.name === 'includeElement');
        expect(includeElement).to.not.be.undefined();
    });

    it('should have the `takeScreenshot` method', () => {
        let takeScreenshot = description.methods.find(method => method.name === 'takeScreenshot');
        expect(takeScreenshot).to.not.be.undefined();
    });
});
