// Constants:
import { SERVER_ERROR } from './constants';

// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import * as tractorLogger from '@tractor/logger';

// Under test:
import { handleError } from './handle-error';

describe('@tractor/error-handler: handle-error:', () => {
    it('should log the error to the console', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: () => {},
            send: () => {}
        };

        handleError(response, new Error(), 'error');

        expect(tractorLogger.error).to.have.been.calledWith('error');

        tractorLogger.error.restore();
    });

    it('should fall back to the `message` from the given `error`', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: () => {},
            send: () => {}
        };

        handleError(response, new Error('error'));

        expect(tractorLogger.error).to.have.been.calledWith('error');

        tractorLogger.error.restore();
    });

    it('should have a `status` of `500`', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: () => {},
            send: () => {}
        };
        sinon.spy(response, 'status');

        handleError(response, new Error());

        expect(response.status).to.have.been.calledWith(SERVER_ERROR);

        tractorLogger.error.restore();
    });

    it('should response with the `message`', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: () => {},
            send: () => {}
        };
        sinon.spy(response, 'send');

        handleError(response, new Error(), 'error');

        let [responseData] = response.send.firstCall.args;
        expect(JSON.parse(responseData).error).to.equal('error');

        tractorLogger.error.restore();
    });

    it('should fall back to the `message` from the given `error`', () => {
        sinon.stub(tractorLogger, 'error');
        let response = {
            status: () => {},
            send: () => {}
        };
        sinon.spy(response, 'send');

        handleError(response, new Error('error'));

        let [responseData] = response.send.firstCall.args;
        expect(JSON.parse(responseData).error).to.equal('error');

        tractorLogger.error.restore();
    });
});
