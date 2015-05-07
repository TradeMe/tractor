'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../../Core/Services/StringToLiteralService');

var createArgumentModelConstructor = function (
    ASTCreatorService,
    StringToLiteralService
) {
    var ArgumentModel = function ArgumentModel (method, argument) {
        Object.defineProperties(this, {
            method: {
                get: function () {
                    return method || null;
                }
            },
            name: {
                get: function () {
                    return argument ? argument.name : false;
                }
            },
            description: {
                get: function () {
                    return argument ? argument.description : false;
                }
            },
            type: {
                get: function () {
                    return argument ? argument.type : false;
                }
            },
            required: {
                get: function () {
                    return argument ? !!argument.required : false;
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.value = '';
    };

    return ArgumentModel;

    function toAST () {
        var ast = ASTCreatorService;

        var literal = StringToLiteralService.toLiteral(this.value);
        var parameter = null;
        var result = null;
        if (this.method) {
            parameter = _.find(this.method.interaction.action.parameters, function (parameter) {
                return parameter.name === this.value;
            }, this);

            result = _.find(this.method.interaction.action.interactions, function (interaction) {
                var returns = interaction.method[interaction.method.returns];
                return returns ? returns.name === this.value : false;
            }, this);
        }

        if (!_.isUndefined(literal)) {
            return ast.literal(literal);
        } else if (parameter) {
            return ast.identifier(parameter.variableName);
        } else if (result) {
            return ast.identifier(this.value);
        } else if (this.value) {
            return ast.literal(this.value);
        } else {
            return ast.literal(null);
        }
    }
};

ComponentEditor.factory('ArgumentModel', function (
    ASTCreatorService,
    StringToLiteralService
) {
    return createArgumentModelConstructor(ASTCreatorService, StringToLiteralService);
});
