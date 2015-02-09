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
    var DEFAULTS = {
        type: 'model',
        locator: 'locator'
    };

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

        this.type = DEFAULTS.type;
        this.locator = DEFAULTS.locator;
    };

    FilterModel.prototype.types = ['model', 'binding', 'text', 'css', 'options', 'repeater'];

    FilterModel.prototype.setValidValue = function (property, value) {
        this[property] = value || DEFAULTS[property];
    };

    return FilterModel;

    function toAST (all) {
        var ast = ASTCreatorService;

        var byIdentifier = ast.identifier('by');
        var locatorLiteral = ast.literal(this.locator);
        if (!all) {
            if (!this.isText) {
                var byMemberExpression = ast.memberExpression(byIdentifier, ast.identifier(this.type));
                return ast.callExpression(byMemberExpression, [locatorLiteral]);
            } else {
                var cssContainingTextIdentifier = ast.identifier('cssContainingText');
                var byMemberExpression = ast.memberExpression(byIdentifier, cssContainingTextIdentifier);
                var allSelectorLiteral = ast.literal('*');
                return ast.callExpression(byMemberExpression, [allSelectorLiteral, locatorLiteral]);
            }
        } else {
            var locator = StringToLiteralService.toLiteral(this.locator);
            if (_.isNumber(locator)) {
                return ast.literal(locator);
            } else {
                var elementIdentifier = ast.identifier('element');
                var elementGetTextMemberExpression = ast.memberExpression(elementIdentifier, ast.identifier('getText'));
                var getTextCallExpression = ast.callExpression(elementGetTextMemberExpression);
                var getTextThenMemberExpression = ast.memberExpression(getTextCallExpression, ast.identifier('then'));
                var textIdentifier = ast.identifier('text');
                var textIndexOfMemberExpresion = ast.memberExpression(textIdentifier, ast.identifier('indexOf'));
                var textIndexOfCallExpression = ast.callExpression(textIndexOfMemberExpresion, [ast.literal(this.locator)]);
                var negativeOneUnaryExpression = ast.unaryExpression(ast.UnaryOperators.NEGATION, ast.literal(1), true);
                var textFoundBinaryExpression = ast.binaryExpression(ast.BinaryOperators.STRICT_INEQUALITY, textIndexOfCallExpression, negativeOneUnaryExpression);
                var checkFoundTextReturnStatement = ast.returnStatement(textFoundBinaryExpression);
                var checkFoundTextBodyBlockStatement = ast.blockStatement([checkFoundTextReturnStatement]);
                var checkFoundTextFunctionExpression = ast.functionExpression(null, [textIdentifier], checkFoundTextBodyBlockStatement);
                var getTextThenCallExpression = ast.callExpression(getTextThenMemberExpression, [checkFoundTextFunctionExpression]);
                var getTextThenReturnStatement = ast.returnStatement(getTextThenCallExpression);
                var getTextThenBodyBlockStatement = ast.blockStatement([getTextThenReturnStatement]);
                return ast.functionExpression(null, [elementIdentifier], getTextThenBodyBlockStatement);
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
