'use strict';

// Utilities:
var log = require('../utils/logging');

module.exports = errorHandler;

function errorHandler (response, error, message) {
    log.error(message || error.message);
    response.status(error.status || 500);
    response.send(JSON.stringify({
        error: message || error.message
    }));
}
