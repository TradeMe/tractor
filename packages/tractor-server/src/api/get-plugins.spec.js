/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import tractorPluginLoader from 'tractor-plugin-loader';

// Under test:
import getPlugins from './get-plugins';

describe('server/api: get-plugins', () => {
    it('should respond with the descriptions of all installed plugins', () => {
        let pluginDescriptions = {};
        let request = {};
        let response = {
            send: () => {}
        };

        sinon.stub(response, 'send');
        sinon.stub(tractorPluginLoader, 'getPluginDescriptions').returns(pluginDescriptions);

        getPlugins.handler(request, response);

        expect(response.send).to.have.been.calledWith(pluginDescriptions);
    });
});
