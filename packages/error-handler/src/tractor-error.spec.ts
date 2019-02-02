// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Under test:
import { TractorError } from './tractor-error';

describe('@tractor/error-handler: TractorError:', () => {
    describe('TractorError constructor:', () => {
        it('should create a new TractorError', () => {
            const error = new TractorError('error');

            expect(error).to.be.an.instanceof(TractorError);
            expect(error.name).to.equal('TractorError');
        });

        it('should inherit from Error', () => {
            const error = new TractorError('error');

            expect(error).to.be.an.instanceof(Error);
        });

        it('should have an error message', () => {
            const error = new TractorError('message');

            expect(error.message).to.equal('message');
        });

        it('should have an default status of 500', () => {
            const error = new TractorError('error');

            const expectedError = 500;
            expect(error.status).to.equal(expectedError);
        });

        it('should let you override the status', () => {
            const expectedError = 404;
            const error = new TractorError('error', expectedError);

            expect(error.status).to.equal(expectedError);
        });

        it('should capture the stack trace', () => {
            const captureStackTrace = sinon.stub(Error, 'captureStackTrace');

            // HACK:
            // Don't need to do anything with the constructed `TractorError`!
            // tslint:disable-next-line:no-unused-expression
            new TractorError('error');

            expect(captureStackTrace.callCount > 0).to.equal(true);

            captureStackTrace.restore();
        });
    });

    describe('TractorError.isTractorError:', () => {
        it('should be `true` for instances of TractorError', () => {
            expect(TractorError.isTractorError(new TractorError('error'))).to.equal(true);
        });

        it('should be `true` for TractorError-like objects', () => {
            expect(TractorError.isTractorError({ _isTractorError: true })).to.equal(true);
        });

        it('should be `false` for non-TractorError objects', () => {
            expect(TractorError.isTractorError({})).to.equal(false);
        });
    });
});
