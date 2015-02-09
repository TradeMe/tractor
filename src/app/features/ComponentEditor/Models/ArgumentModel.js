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
    var DEFAULTS = {
        string: 'argument',
        number: 12345,
        boolean: true
    };

    var ArgumentModel = function ArgumentModel (method, argument) {
        Object.defineProperties(this, {
            method: {
                get: function () {
                    return method || null;
                }
            },
            optional: {
                get: function () {
                    return argument ? argument.optional : false;
                }
            },
            default: {
                get: function () {
                    return this.optional ? null : DEFAULTS[this.type];
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        if (argument) {
            this.name = argument.name;
            this.type = argument.type;
        }
        this.value = this.default;
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
        } else if (parameter || result) {
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
