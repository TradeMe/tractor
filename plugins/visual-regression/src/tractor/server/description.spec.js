// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { description } from './description';

describe('@tractor-plugins/visual-regression - description:', () => {
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
