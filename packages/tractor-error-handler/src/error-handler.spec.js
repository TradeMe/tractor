/* global describe:true, it:true */

// Constants:
import constants from './constants';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import * as tractorLogger from 'tractor-logger';

// Under test:
import { handle } from './error-handler';

describe('tractor-error-handler: error-handler:', () => {
    it('should log the error to the console', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };

        handle(response, new Error(), 'error');

        expect(tractorLogger.error).to.have.been.calledWith('error');

        tractorLogger.error.restore();
    });

    it('should fall back to the `message` from the given `error`', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };

        handle(response, new Error('error'));

        expect(tractorLogger.error).to.have.been.calledWith('error');

        tractorLogger.error.restore();
    });

    it('should have a `status` of `500`', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };
        sinon.spy(response, 'status');

        handle(response, new Error());

        expect(response.status).to.have.been.calledWith(constants.SERVER_ERROR);

        tractorLogger.error.restore();
    });

    it('should response with the `message`', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };
        sinon.spy(response, 'send');

        handle(response, new Error(), 'error');

        let [responseData] = response.send.firstCall.args;
        expect(JSON.parse(responseData).error).to.equal('error');

        tractorLogger.error.restore();
    });

    it('should fall back to the `message` from the given `error`', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };
        sinon.spy(response, 'send');

        handle(response, new Error('error'));

        let [responseData] = response.send.firstCall.args;
        expect(JSON.parse(responseData).error).to.equal('error');

        tractorLogger.error.restore();
    });
});
