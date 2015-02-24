'use strict';

// Module:
var Core = require('../Core');

var ValidationService = function ($http) {
    return {
        validateVariableName: validateVariableName
    };

    function validateVariableName (variableName) {
        return $http.post('/validate-javascript-variable-name', {
            variableName: variableName
        })
        .then(function () {
            return variableName;
        });
    }
};

Core.service('ValidationService', ValidationService);
