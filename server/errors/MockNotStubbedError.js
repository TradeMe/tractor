'use strict';

var MockNotStubbedError = function MockNotStubbedError (message) {
    this.message = message;
    this.name = 'MockNotStubbedError';
    Error.captureStackTrace(this, MockNotStubbedError);
};
MockNotStubbedError.prototype = Object.create(Error.prototype);

module.exports = MockNotStubbedError;
