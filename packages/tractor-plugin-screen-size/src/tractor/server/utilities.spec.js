/* global describe:true, it:true */

// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { createTag } from './utilities';

describe('tractor-plugin-screen-size - utilities:', () => {
    describe('tractor-plugin-screen-size - createTag:', () => {
        it('should create a tag for a screen size', () => {
            let tag = createTag('sm');

            expect(tag).to.equal('@screen-size:sm');
        });
    });
});
