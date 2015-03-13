'use strict';

var BaseTestFileAlreadyExistsError = function BaseTestFileAlreadyExistsError (message) {
    this.message = message;
    this.name = 'BaseTestFileAlreadyExistsError';
    Error.captureStackTrace(this, BaseTestFileAlreadyExistsError);
};
BaseTestFileAlreadyExistsError.prototype = Object.create(Error.prototype);

module.exports = BaseTestFileAlreadyExistsError;
