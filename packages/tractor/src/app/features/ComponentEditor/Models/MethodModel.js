'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ArgumentModel');

var createMethodModelConstructor = function (ASTCreatorService, ArgumentModel) {
    var ast = ASTCreatorService;

    var MethodModel = function MethodModel (interaction, method) {
        var args = getArguments.call(this, method);

        Object.defineProperties(this, {
            interaction: {
                get: function () {
                    return interaction;
                }
            },
            name: {
                get: function () {
                    return this.nameIdentifier.name;
                }
            },
            arguments: {
                get: function () {
                    return args;
                },
                set: function (newArgs) {
                    args = newArgs;
                }
            },
            returns: {
                get: function () {
                    return method.returns;
                }
            }
        });

        this.nameIdentifier = ast.createIdentifier(method.name);

        if (this.returns) {
            this[this.returns] = method[this.returns];
        }
    };
    
    return MethodModel;

    function getArguments (method) {
        return _.map(method.arguments, function (argument) {
            return new ArgumentModel(this, argument);
        }, this);
    }
};

ComponentEditor.factory('MethodModel', function (
    ASTCreatorService,
    ArgumentModel
) {
    return createMethodModelConstructor(ASTCreatorService, ArgumentModel);
});
