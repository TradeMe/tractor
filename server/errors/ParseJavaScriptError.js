'use strict';

var ParseJavaScriptError = function ParseJavaScriptError (message) {
    this.status = 400;
    this.message = message;
    this.name = 'ParseJavaScriptError';
    Error.captureStackTrace(this, ParseJavaScriptError);
};

ParseJavaScriptError.prototype = Object.create(Error.prototype);

module.exports = ParseJavaScriptError;
