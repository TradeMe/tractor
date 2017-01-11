// Constants:
import CONSTANTS from './constants';

// NOTE -
// This could be written as `class TractorError extends Error`
// but that doesn't play nicely with Bluebird typed catches.
// Instead we do it the ES5 way:
function TractorError (message, status) {
    this.message = message;
    this.name = CONSTANTS.TRACTOR_ERROR;
    this.status = status || CONSTANTS.SERVER_ERROR;
    Error.captureStackTrace(this, TractorError);
}

TractorError.prototype = Object.create(Error.prototype);
TractorError.prototype.constructor = TractorError;

// NOTE -
// When error instances are shared between modules that use
// 'tractor-error-handler', they may not actually be instances
// of the same TractorError constructor. This is a pretty
// fragile way to test this, so I've asked a question on SO,
// hopefully that leads to a better solution:
//
//    http://stackoverflow.com/questions/41587865
//
TractorError.isTractorError = e => e.name === TractorError.name && e.constructor.name === CONSTANTS.TRACTOR_ERROR;

export default TractorError;
