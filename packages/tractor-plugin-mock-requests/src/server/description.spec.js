/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Under test:
import description from './description';

describe('tractor-plugin-mock-requests - description:', () => {
    it('should be an empty object', () => {
        expect(description).to.deep.equal({});
    });
});
