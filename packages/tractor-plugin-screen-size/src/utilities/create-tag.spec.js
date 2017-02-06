/* global describe:true, it:true */

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Under test:
import { createTag } from './create-tag';

describe('tractor-plugin-screen-size - create-tag:', () => {
    it('should create a tag for a screen size', () => {
        let tag = createTag('sm');

        expect(tag).to.equal('@screen-size:sm');
    });
});
