// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { VisualRegression } from './visual-regression/visual-regression';

// Under test:
import { create } from './create';

describe('@tractor-plugins/visual-regression - create:', () => {
    it('should make a new VisualRegression', () => {
        let browser = {};
        let config = {
            visualRegression: {}
        };

        let visualRegression = create(browser, config);

        expect(visualRegression).to.be.an.instanceof(VisualRegression);
    });
});
