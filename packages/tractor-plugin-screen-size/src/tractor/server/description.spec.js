/* global describe:true, it:true */

// Test setup:
import { expect } from '../../../test-setup.js';

// Under test:
import { description } from './description';

describe('tractor-plugin-screen-size - description:', () => {
    it('should have the `setSize` method', () => {
        let setSize = description.methods.find(method => method.name === 'setSize');
        expect(setSize).to.not.be.undefined();
    });
});
