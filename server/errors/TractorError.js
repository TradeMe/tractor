'use strict';

export default class TractorError extends Error {
    constructor (message, status) {
        super();
        this.message = message;
        this.name = 'TractorError';
        this.status = status || 500;
        Error.captureStackTrace(this, TractorError);
    };
}
