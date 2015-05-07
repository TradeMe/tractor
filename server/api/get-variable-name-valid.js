'use strict';

// Utilities:
var errorHandler = require('../utils/error-handler');

// Dependencies:
var charFunk = require('CharFunk');

// Errors:
var InvalidVariableNameError = require('../Errors/InvalidVariableNameError');

module.exports = getVariableNameValid;

function getVariableNameValid (request, response) {
    var data = {
        result: charFunk.isValidName(request.query.variableName, true)
    };

    if (data.result) {
        response.send(JSON.stringify(data));
    } else {
        errorHandler(response, new InvalidVariableNameError('Invalid name.'));
    }
}
