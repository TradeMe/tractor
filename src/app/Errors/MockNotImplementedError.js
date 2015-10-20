'use strict';

var MockNotImplementedError = function MockNotImplementedError (message) {
    this.message = message;
    this.name = 'MockNotImplementedError';
    Error.captureStackTrace(this, MockNotImplementedError);
};
MockNotImplementedError.prototype = Object.create(Error.prototype);

module.exports = MockNotImplementedError;
