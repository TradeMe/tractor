// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { description } from './description';

describe('@tractor-plugins/visual-regression - description:', () => {
    it('should have the `ignoreElement` action', () => {
        const ignoreElement = description.actions.find(action => action.name === 'ignore element');
        expect(ignoreElement).to.not.equal(undefined);
    });

    it('should have the `includeElement` action', () => {
        const includeElement = description.actions.find(action => action.name === 'include element');
        expect(includeElement).to.not.equal(undefined);
    });

    it('should have the `takeScreenshot` action', () => {
        const takeScreenshot = description.actions.find(action => action.name === 'take screenshot');
        expect(takeScreenshot).to.not.equal(undefined);
    });

    it('should have the `takeScreenshotOfElement` action', () => {
        const takeScreenshotOfElement = description.actions.find(action => action.name === 'take screenshot of element');
        expect(takeScreenshotOfElement).to.not.equal(undefined);
    });
});
