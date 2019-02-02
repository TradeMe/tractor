// Constants:
import { SERVER_ERROR, TRACTOR_ERROR } from './constants';

export class TractorError implements Error {
    // NOTE -
    // When error instances are shared between modules that use
    // @tractor/error-handler, they may not actually be instances
    // of the same TractorError constructor.
    public static isTractorError (err: TractorError | { _isTractorError?: boolean }): err is TractorError {
        return !!(err as TractorError)._isTractorError;
    }

    public name = TRACTOR_ERROR;

    private readonly _isTractorError = true;

    public constructor (
        public readonly message: string,
        public readonly status: number = SERVER_ERROR
    ) {
        Object.setPrototypeOf(this, TractorError.prototype);
        Error.captureStackTrace(this, TractorError);
    }
}

// NOTE -
// A bit of prototype magic is required to make chai do a
// *real* deep equal instead of assuming that Error instances
// should be checked by reference
TractorError.prototype = Object.create(Error.prototype) as TractorError;
TractorError.prototype.constructor = TractorError;
