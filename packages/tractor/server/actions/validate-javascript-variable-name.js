'use strict';

// Utilities:
var errorHandler = require('../utils/error-handler');

// Dependencies:
var charFunk = require('CharFunk');

// Errors:
var InvalidVariableNameError = require('../Errors/InvalidVariableNameError');

module.exports = valiateJavaScriptVariableName;

function valiateJavaScriptVariableName (request, response) {
    var data = {
        result: charFunk.isValidName(request.body.variableName, true)
    };

    if (data.result) {
        response.send(JSON.stringify(data));
    } else {
        errorHandler(response, new InvalidVariableNameError('Invalid variable name.'));
    }
}
