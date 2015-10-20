'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
var camelcase = require('change-case').camel;
require('../../../Core/Services/ASTCreatorService');

var createParameterModelConstructor = function (
    astCreatorService
) {
    var ParameterModel = function ParameterModel (action) {
        Object.defineProperties(this, {
            action: {
                get: function () {
                    return action;
                }
            },
            variableName: {
                get: function () {
                    return camelcase(this.name);
                }
            },
            meta: {
                get: function () {
                    return {
                        name: this.name
                    };
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.name = '';
    };

    ParameterModel.prototype.getAllVariableNames = function () {
        var currentParameter = this;
        return _.chain(this.action.parameters)
        .reject(function (parameter) {
            return parameter === currentParameter;
        }).map(function (object) {
            return object.name;
        }).compact().value();
    };

    return ParameterModel;

    function toAST () {
        var ast = astCreatorService;
        return ast.identifier(this.variableName);
    }
};

ComponentEditor.factory('ParameterModel', function (
    astCreatorService
) {
    return createParameterModelConstructor(astCreatorService);
});
