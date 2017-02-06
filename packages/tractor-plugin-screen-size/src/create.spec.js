/* global describe:true, it:true */

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Dependencies:
import { ScreenSize } from './screen-size/screen-size';

// Under test:
import create from './create';

describe('tractor-plugin-screen-size - create:', () => {
    it('should make a new ScreenSize', () => {
        let browser = {};
        let config = {};

        let screenSize = create(browser, config);

        expect(screenSize).to.be.an.instanceof(ScreenSize);
    });
});
