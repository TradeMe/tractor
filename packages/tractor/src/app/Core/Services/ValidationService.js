'use strict';

// Module:
var Core = require('../Core');

var ValidationService = function ($http) {
    return {
        validateVariableName: validateVariableName
    };

    function validateVariableName (variableName) {
        return $http.get('/variable-name-valid', {
            params: {
                variableName: variableName
            }
        })
        .then(function () {
            return variableName;
        });
    }
};

Core.service('ValidationService', ValidationService);
