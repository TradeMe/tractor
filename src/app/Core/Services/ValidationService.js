'use strict';

// Module:
var Core = require('../Core');

// Dependencies:
// var charFunk = require('charfunk');

var ValidationService = function () {
    return {
        validateVariableName: validateVariableName
    };

    function validateVariableName (variableName) {
        return true;
        // return charFunk.isValidName(variableName, true) ? variableName : false;
    }
};

Core.service('validationService', ValidationService);
