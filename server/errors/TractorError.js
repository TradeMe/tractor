'use strict';

// Constants:
import constants from '../constants';

export default class TractorError extends Error {
    constructor (message, status) {
        super();
        this.message = message;
        this.name = 'TractorError';
        this.status = status || constants.SERVER_ERROR;
        Error.captureStackTrace(this, TractorError);
    }
}
