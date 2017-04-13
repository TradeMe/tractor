/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Under test:
import { getConfigHandler } from './get-config';

describe('server/api: get-config:', () => {
    it('should respond with the current config', () => {
        let config = {};
        let request = {};
        let response = {
            send: () => {}
        };

        sinon.stub(response, 'send');

        getConfigHandler(config)(request, response);

        expect(response.send).to.have.been.calledWith(config);
    });
});
