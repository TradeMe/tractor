'use strict';

var ProtractorRunError = function ProtractorRunError (message) {
    this.message = message;
    this.name = 'ProtractorRunError';
    Error.captureStackTrace(this, ProtractorRunError);
};
ProtractorRunError.prototype = Object.create(Error.prototype);

module.exports = ProtractorRunError;
