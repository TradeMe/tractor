'use strict';

var InvalidVariableNameError = function InvalidVariableNameError (message) {
    this.status = 400;
    this.message = message;
    this.name = 'InvalidVariableNameError';
    Error.captureStackTrace(this, InvalidVariableNameError);
};

InvalidVariableNameError.prototype = Object.create(Error.prototype);

module.exports = InvalidVariableNameError;
