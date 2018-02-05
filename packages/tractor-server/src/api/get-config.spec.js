/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from 'tractor-unit-test';

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
