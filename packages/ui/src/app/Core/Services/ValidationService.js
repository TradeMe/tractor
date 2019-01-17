'use strict';

// Module:
var Core = require('../Core');

// Dependencies:
var isValidIdentifier = require('is-valid-identifier')

var ValidationService = function () {
    return {
        validateVariableName: validateVariableName
    };

    function validateVariableName (variableName) {
        return isValidIdentifier(variableName) ? variableName : false;
    }
};

Core.service('validationService', ValidationService);
