'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ArgumentModel');

var MethodModel = function (ASTCreatorService, ArgumentModel) {
    var ast = ASTCreatorService;

    var MethodModel = function MethodModel (interaction, method) {
        this._args = getArguments.call(this, method);

        Object.defineProperties(this, {
            interaction: {
                get: function () { return interaction; }
            },
            name: {
                get: function () { return this.nameIdentifier.name; }
            },
            arguments: {
                get: function () { return this._args; }
            },
            returns: {
                get: function () { return method.returns; }
            }
        });

        this.nameIdentifier = ast.createIdentifier(method.name);

        if (this.returns) {
            this[this.returns] = method[this.returns];
        }
    };

    var getArguments = function (method) {
        return _.map(method.arguments, function (argument) {
            return new ArgumentModel(this, argument);
        }, this);
    };

    MethodModel.prototype.setArguments = function (args) {
        this._args = args;
    };

    return MethodModel;
};

ComponentEditor.factory('MethodModel', function (
    ASTCreatorService,
    ArgumentModel
) {
    return MethodModel(ASTCreatorService, ArgumentModel);
});
