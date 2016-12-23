'use strict';

// Utilities:
var path = require('path');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Depenedencies:
var camel = require('change-case').camel;
require('./ParameterMetaModel');

var createActionMetaModelConstructor = function (
    ParameterMetaModel
) {
    var ActionMetaModel = function ActionMetaModel (action) {
        var parameters = action.parameters.map(function (parameter) {
            return new ParameterMetaModel(parameter);
        });

        Object.defineProperties(this, {
            name: {
                get: function () {
                    return action.name;
                }
            },
            variableName: {
                get: function () {
                    return camel(this.name);
                }
            },
            parameters: {
                get: function () {
                    return parameters;
                }
            }
        });
    };

    return ActionMetaModel;
};

StepDefinitionEditor.factory('ActionMetaModel', function (
  ParameterMetaModel
) {
    return createActionMetaModelConstructor(ParameterMetaModel);
});
