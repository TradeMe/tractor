/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Under test:
import { getPluginsHandler } from './get-plugins';

describe('server/api: get-plugins', () => {
    it('should respond with the descriptions of all installed plugins', () => {
        let plugins = [{
            description: 'foo'
        }, {
            description: 'bar'
        }];
        let request = {};
        let response = {
            send: () => {}
        };

        sinon.stub(response, 'send');

        getPluginsHandler(plugins)(request, response);

        expect(response.send).to.have.been.calledWith(['foo', 'bar']);
    });
});
