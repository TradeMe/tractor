/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Under test:
import description from './description';

describe('tractor-plugin-browser - description:', () => {
    it('should have the `get` method', () => {
        let get = description.methods.find(method => method.name === 'get');
        expect(get).to.not.be.undefined();
    });

    it('should have the `refresh` method', () => {
        let refresh = description.methods.find(method => method.name === 'refresh');
        expect(refresh).to.not.be.undefined();
    });

    it('should have the `setLocation` method', () => {
        let setLocation = description.methods.find(method => method.name === 'setLocation');
        expect(setLocation).to.not.be.undefined();
    });

    it('should have the `getLocationAbsUrl` method', () => {
        let getLocationAbsUrl = description.methods.find(method => method.name === 'getLocationAbsUrl');
        expect(getLocationAbsUrl).to.not.be.undefined();
    });

    it('should have the `waitForAngular` method', () => {
        let waitForAngular = description.methods.find(method => method.name === 'waitForAngular');
        expect(waitForAngular).to.not.be.undefined();
    });

    it('should have the `pause` method', () => {
        let pause = description.methods.find(method => method.name === 'pause');
        expect(pause).to.not.be.undefined();
    });
});
