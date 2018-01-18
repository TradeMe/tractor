/* global describe:true, it:true */

// Test setup:
import { expect } from '../../../test-setup.js';

// Under test:
import { description } from './description';

describe('tractor-plugin-screen-size - description:', () => {
    it('should have the `setSize` action', () => {
        let setSize = description.actions.find(action => action.name === 'set size');
        expect(setSize).to.not.be.undefined();
    });
});
