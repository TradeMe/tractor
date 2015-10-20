'use strict';

// Module:
var Core = require('../Core');

// Dependencies:
var charFunk = require('CharFunk');

var ValidationService = function () {
    return {
        validateVariableName: validateVariableName
    };

    function validateVariableName (variableName) {
        return charFunk.isValidName(variableName, true) ? variableName : false;
    }
};

Core.service('validationService', ValidationService);
