'use strict';

var GenerateJavaScriptError = function GenerateJavaScriptError (message) {
    this.message = message;
    this.name = 'GenerateJavaScriptError';
    Error.captureStackTrace(this, GenerateJavaScriptError);
};
GenerateJavaScriptError.prototype = Object.create(Error.prototype);

module.exports = GenerateJavaScriptError;
