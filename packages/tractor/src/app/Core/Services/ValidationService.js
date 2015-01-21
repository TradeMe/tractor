'use strict';

// Module:
var Core = require('../Core');

var ValidationService = function ($http) {
    return {
        validateVariableName: validateVariableName
    };

    function validateVariableName (variableName, capital) {
        return $http.post('/validate-javascript-variable-name', {
            variableName: variableName
        })
        .then(function (result) {
            if (result.error) {
                throw new Error(result.error);
            }
            return variableName.charAt(0)['to' + (capital ? 'Upper' : 'Lower') + 'Case']() + variableName.slice(1);
        });
    }
};

Core.service('ValidationService', ValidationService);
