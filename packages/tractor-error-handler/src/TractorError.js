// Constants:
import { SERVER_ERROR, TRACTOR_ERROR } from './constants';

// NOTE -
// This could be written as `class TractorError extends Error`
// but that doesn't play nicely with Bluebird typed catches.
// Instead we do it the ES5 way:
export function TractorError (message, status) {
    this.message = message;
    this.name = TRACTOR_ERROR;
    this.status = status || SERVER_ERROR;
    Error.captureStackTrace(this, TractorError);
}

TractorError.prototype = Object.create(Error.prototype);
TractorError.prototype.constructor = TractorError;
TractorError.prototype._isTractorError = true;

// NOTE -
// When error instances are shared between modules that use
// 'tractor-error-handler', they may not actually be instances
// of the same TractorError constructor.
TractorError.isTractorError = e => !!e._isTractorError;
