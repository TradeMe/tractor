'use strict';

// Utilities:
var _ = require('lodash');
var toLiteral = require('../../../utilities/toLiteral');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var ArgumentModel = function (ASTCreatorService) {
    var ast = ASTCreatorService;

    var DEFAULTS = {
        string: 'argument',
        number: 12345,
        boolean: true
    };

    var ArgumentModel = function ArgumentModel (method, argument) {
        Object.defineProperties(this, {
            method: {
                get: function () { return method || null; }
            },
            optional: {
                get: function () { return argument ? argument.optional : false; }
            },
            default: {
                get: function () { return this.optional ? null : DEFAULTS[this.type]; }
            },
            ast: {
                get: function () { return toAST.call(this); }
            }
        });

        if (argument) {
            this.name = argument.name;
            this.type = argument.type
        }
        this.value = this.default;
    };

    var toAST = function () {
        var literal = toLiteral(this.value);

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
            return ast.createLiteral(literal);
        } else if (parameter || result) {
            return ast.createIdentifier(this.value);
        } else if (this.value) {
            return ast.createLiteral(this.value);
        } else {
            return ast.createLiteral(null);
        }
    };

    return ArgumentModel;
};

ComponentEditor.factory('ArgumentModel', function (ASTCreatorService) {
    return ArgumentModel(ASTCreatorService);
});
