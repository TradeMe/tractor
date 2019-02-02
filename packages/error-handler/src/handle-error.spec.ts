// Test setup:
import { expect, ineeda, sinon } from '@tractor/unit-test';

// Dependencies:
import * as tractorLogger from '@tractor/logger';
import { Response } from 'express';

// Under test:
import { handleError } from './handle-error';

describe('@tractor/error-handler: handle-error:', () => {
    it('should log the error to the console', () => {
        sinon.stub(tractorLogger, 'error');
        const response = ineeda<Response>({
            send: (): Response => response,
            status: (): Response => response
        });

        handleError(response, new Error(), 'error');

        expect(tractorLogger.error).to.have.been.calledWith('error');

        (tractorLogger.error as sinon.SinonStub).restore();
    });

    it('should fall back to the `message` from the given `error`', () => {
        sinon.stub(tractorLogger, 'error');
        const response = ineeda<Response>({
            send: (): Response => response,
            status: (): Response => response
        });

        handleError(response, new Error('fallback'));

        expect(tractorLogger.error).to.have.been.calledWith('fallback');

        (tractorLogger.error as sinon.SinonStub).restore();
    });

    it('should have a `status` of `500`', () => {
        sinon.stub(tractorLogger, 'error');
        const response = ineeda<Response>({
            send: (): Response => response,
            status: (): Response => response
        });

        handleError(response, new Error());

        const expectedError = 500;
        expect(response.status).to.have.been.calledWith(expectedError);

        (tractorLogger.error as sinon.SinonStub).restore();
    });

    it('should response with the `message`', () => {
        sinon.stub(tractorLogger, 'error');
        const response = ineeda<Response>({
            send: (): Response => response,
            status: (): Response => response
        });

        handleError(response, new Error(), 'error');

        expect(response.send).to.have.been.calledWith(JSON.stringify({ error: 'error' }));

        (tractorLogger.error as sinon.SinonStub).restore();
    });

    it('should fall back to the `message` from the given `error`', () => {
        sinon.stub(tractorLogger, 'error');
        const response = ineeda<Response>({
            send: (): Response => response,
            status: (): Response => response
        });

        handleError(response, new Error('fallback'));

        expect(response.send).to.have.been.calledWith(JSON.stringify({ error: 'fallback' }));

        (tractorLogger.error as sinon.SinonStub).restore();
    });
});
