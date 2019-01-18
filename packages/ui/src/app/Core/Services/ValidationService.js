'use strict';

// Module:
var Core = require('../Core');

// Dependencies:
var isValidVariableName = require('is-valid-var-name')

var ValidationService = function () {
    return {
        validateVariableName: validateVariableName
    };

    function validateVariableName (variableName) {
        return isValidVariableName(variableName) ? variableName : false;
    }
};

Core.service('validationService', ValidationService);
