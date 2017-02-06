/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Under test:
import description from './description';

describe('tractor-plugin-screen-size - description:', () => {
    it('should have the `setSize` method', () => {
        let setSize = description.methods.find(method => method.name === 'setSize');
        expect(setSize).to.not.be.undefined();
    });
});
