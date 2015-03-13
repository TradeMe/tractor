'use strict';

var LexGherkinError = function LexGherkinError (message) {
    this.status = 400;
    this.message = message;
    this.name = 'LexGherkinError';
    Error.captureStackTrace(this, LexGherkinError);
};

LexGherkinError.prototype = Object.create(Error.prototype);

module.exports = LexGherkinError;
