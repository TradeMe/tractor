'use strict';

var UnknownOperationError = function UnknownOperationError (message) {
    this.message = message;
    this.name = 'UnknownOperationError';
    Error.captureStackTrace(this, UnknownOperationError);
};
UnknownOperationError.prototype = Object.create(Error.prototype);

module.exports = UnknownOperationError;
