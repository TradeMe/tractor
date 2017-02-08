/* global describe:true, it:true */

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Dependencies:
import { VisualRegression } from './visual-regression/visual-regression';

// Under test:
import create from './create';

describe('tractor-plugin-/visual-regression - create:', () => {
    it('should make a new VisualRegression', () => {
        let browser = {};
        let config = {};

        let visualRegression = create(browser, config);

        expect(visualRegression).to.be.an.instanceof(VisualRegression);
    });
});
