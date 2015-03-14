'use strict';

var LexFeatureError = function LexFeatureError (message) {
    this.status = 400;
    this.message = message;
    this.name = 'LexFeatureError';
    Error.captureStackTrace(this, LexFeatureError);
};

LexFeatureError.prototype = Object.create(Error.prototype);

module.exports = LexFeatureError;
