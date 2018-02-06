/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from '@tractor/unit-test';

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
