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
        let { methods } = description;

        let get = methods.find(method => method.name === 'get');
        expect(get).to.not.be.undefined();
    });

    it('should have the `refresh` method', () => {
        let { methods } = description;

        let refresh = methods.find(method => method.name === 'refresh');
        expect(refresh).to.not.be.undefined();
    });

    it('should have the `setLocation` method', () => {
        let { methods } = description;

        let setLocation = methods.find(method => method.name === 'setLocation');
        expect(setLocation).to.not.be.undefined();
    });

    it('should have the `getLocationAbsUrl` method', () => {
        let { methods } = description;

        let getLocationAbsUrl = methods.find(method => method.name === 'getLocationAbsUrl');
        expect(getLocationAbsUrl).to.not.be.undefined();
    });

    it('should have the `waitForAngular` method', () => {
        let { methods } = description;

        let waitForAngular = methods.find(method => method.name === 'waitForAngular');
        expect(waitForAngular).to.not.be.undefined();
    });

    it('should have the `pause` method', () => {
        let { methods } = description;

        let pause = methods.find(method => method.name === 'pause');
        expect(pause).to.not.be.undefined();
    });
});
