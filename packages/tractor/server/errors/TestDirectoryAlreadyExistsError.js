'use strict';

var TestDirectoryAlreadyExistsError = function TestDirectoryAlreadyExistsError (message) {
    this.message = message;
    this.name = 'TestDirectoryAlreadyExistsError';
    Error.captureStackTrace(this, TestDirectoryAlreadyExistsError);
};
TestDirectoryAlreadyExistsError.prototype = Object.create(Error.prototype);

module.exports = TestDirectoryAlreadyExistsError;
