'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var createParameterModelConstructor = function (ASTCreatorService) {
    var ParameterModel = function ParameterModel (action) {
        Object.defineProperties(this, {
            action: {
                get: function () {
                    return action;
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
        var ast = ASTCreatorService;
        return ast.identifier(this.name);
    }
};

ComponentEditor.factory('ParameterModel', function (ASTCreatorService) {
    return createParameterModelConstructor(ASTCreatorService);
});
