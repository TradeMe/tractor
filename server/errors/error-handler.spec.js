/* global describe:true, it:true */
'use strict';

// Constants:
import constants from '../constants';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import log from 'npmlog';

// Under test:
import errorHandler from './error-handler';

describe('server/errors: error-handler:', () => {
    it('should log the error to the console', () => {
        sinon.stub(log, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };

        errorHandler.handler(response, new Error(), 'error');

        expect(log.error).to.have.been.calledWith('error');

        log.error.restore();
    });

    it('should fall back to the `message` from the given `error`', () => {
        sinon.stub(log, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };

        errorHandler.handler(response, new Error('error'));

        expect(log.error).to.have.been.calledWith('error');

        log.error.restore();
    });

    it('should update the `response` status to the `status` of the `error`', () => {
        sinon.stub(log, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };
        sinon.spy(response, 'status');
        let error = new Error();
        error.status = constants.REQUEST_ERROR;

        errorHandler.handler(response, error);

        expect(response.status).to.have.been.calledWith(constants.REQUEST_ERROR);

        log.error.restore();
    });

    it('should fall back to a `status` of `500`', () => {
        sinon.stub(log, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };
        sinon.spy(response, 'status');

        errorHandler.handler(response, new Error());

        expect(response.status).to.have.been.calledWith(constants.SERVER_ERROR);

        log.error.restore();
    });

    it('should response with the `message`', () => {
        sinon.stub(log, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };
        sinon.spy(response, 'send');

        errorHandler.handler(response, new Error(), 'error');

        let [responseData] = response.send.firstCall.args;
        expect(JSON.parse(responseData).error).to.equal('error');

        log.error.restore();
    });

    it('should fall back to the `message` from the given `error`', () => {
        sinon.stub(log, 'error');
        let response = {
            status: _.noop,
            send: _.noop
        };
        sinon.spy(response, 'send');

        errorHandler.handler(response, new Error('error'));

        let [responseData] = response.send.firstCall.args;
        expect(JSON.parse(responseData).error).to.equal('error');

        log.error.restore();
    });
});
