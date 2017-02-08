/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Under test:
import description from './description';

describe('tractor-plugin-visual-regression - description:', () => {
    it('should have the `ignoreArea` method', () => {
        let ignoreArea = description.methods.find(method => method.name === 'ignoreArea');
        expect(ignoreArea).to.not.be.undefined();
    });

    it('should have the `includeArea` method', () => {
        let includeArea = description.methods.find(method => method.name === 'includeArea');
        expect(includeArea).to.not.be.undefined();
    });

    it('should have the `takeScreenshot` method', () => {
        let takeScreenshot = description.methods.find(method => method.name === 'takeScreenshot');
        expect(takeScreenshot).to.not.be.undefined();
    });
});
