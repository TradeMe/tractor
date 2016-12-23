'use strict';

// Utilities:
var path = require('path');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Depenedencies:
var camel = require('change-case').camel;

var createParameterMetaModelConstructor = function () {
    var ParameterMetaModel = function ParameterMetaModel (parameter) {
        Object.defineProperties(this, {
            name: {
                get: function () {
                    return parameter.name;
                }
            }
        });
    };

    return ParameterMetaModel;
};

StepDefinitionEditor.factory('ParameterMetaModel', function () {
    return createParameterMetaModelConstructor();
});
