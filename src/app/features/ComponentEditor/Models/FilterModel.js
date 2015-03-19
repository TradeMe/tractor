'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../../Core/Services/StringToLiteralService');

var createFilterModelConstructor = function (
    ASTCreatorService,
    StringToLiteralService
) {
    var FilterModel = function FilterModel (element) {
        Object.defineProperties(this, {
            element: {
                get: function () {
                    return element;
                }
            },

            ast: {
                get: function () {
                    return toAST.call(this, false);
                }
            },
            allAst: {
                get: function () {
                    return toAST.call(this, true);
                }
            },

            isAll: {
                get: function () {
                    return this.type === 'options' || this.type === 'repeater';
                }
            },
            isText: {
                get: function () {
                    return this.type === 'text';
                }
            }
        });

        this.type = _.first(this.types);
        this.locator = '';
    };

    FilterModel.prototype.types = ['model', 'binding', 'text', 'css', 'options', 'repeater'];

    return FilterModel;

    function toAST (all) {
        var ast = ASTCreatorService;

        var locatorLiteral = ast.literal(this.locator);
        if (!all) {
            if (!this.isText) {
               return ast.template('by.<%= type %>(<%= locator %>)', {
                    type: ast.identifier(this.type),
                    locator: locatorLiteral
                }).expression;
            } else {
                return ast.template('by.<%= type %>(<%= all %>, <%= locator %>)', {
                    type: ast.identifier('cssContainingText'),
                    all: ast.literal('*'),
                    locator: locatorLiteral
                }).expression;
            }
        } else {
            var number = StringToLiteralService.toLiteral(locatorLiteral.value);
            if (_.isNumber(number)) {
                return ast.literal(number);
            } else {
                return ast.template(
                    '(function (element) {' +
                    '    return element.getText().then(function (text) {' +
                    '        return text.indexOf(<%= locator %>) !== -1;' +
                    '    });' +
                    '});', {
                    locator: locatorLiteral
                }).expression;
            }
        }
    }
};

ComponentEditor.factory('FilterModel', function (
    ASTCreatorService,
    StringToLiteralService
) {
    return createFilterModelConstructor(ASTCreatorService, StringToLiteralService);
});
