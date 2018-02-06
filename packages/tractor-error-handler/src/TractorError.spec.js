/* global describe:true, it:true */

// Constants:
import { SERVER_ERROR } from './constants';

// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Under test:
import { TractorError } from './TractorError';

describe('@tractor/error-handler: TractorError:', () => {
    describe('TractorError constructor:', () => {
        it('should create a new TractorError', () => {
            let error = new TractorError();

            expect(error).to.be.an.instanceof(TractorError);
            expect(error.name).to.equal('TractorError');
        });

        it('should inherit from Error', () => {
            let error = new TractorError();

            expect(error).to.be.an.instanceof(Error);
        });

        it('should have an error message', () => {
            let error = new TractorError('message');

            expect(error.message).to.equal('message');
        });

        it('should have an default status of 500', () => {
            let error = new TractorError();

            expect(error.status).to.equal(SERVER_ERROR);
        });

        it('should capture the stack trace', () => {
            sinon.stub(Error, 'captureStackTrace');

            /* eslint-disable */
            let error = new TractorError();
            /* eslint-enable */

            expect(Error.captureStackTrace).to.have.been.called();

            Error.captureStackTrace.restore();
        });
    });

    describe('TractorError.isTractorError:', () => {
        it('should be `true` for instances of TractorError', () => {
            expect(TractorError.isTractorError(new TractorError())).to.equal(true);
        });

        it('should be `true` for TractorError-like objects', () => {
            expect(TractorError.isTractorError({ _isTractorError: true })).to.equal(true);
        });

        it('should be `false` for non-TractorError objects', () => {
            expect(TractorError.isTractorError({})).to.equal(false);
        });
    });
});
