/* global describe:true, it:true */
'use strict';

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
        error.status = 400;

        errorHandler.handler(response, error);

        expect(response.status).to.have.been.calledWith(400);

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

        expect(response.status).to.have.been.calledWith(500);

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

        let responseData = JSON.parse(response.send.firstCall.args[0]);
        expect(responseData.error).to.equal('error');

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

        let responseData = JSON.parse(response.send.firstCall.args[0]);
        expect(responseData.error).to.equal('error');

        log.error.restore();
    });
});
