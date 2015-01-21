'use strict';

// Utilities:
var _ = require('lodash');
var toLiteral = require('../../../utilities/toLiteral');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var FilterModel = function (ASTCreatorService) {
    var ast = ASTCreatorService;

    var DEFAULTS = {
        type: 'model',
        locator: 'locator'
    };

    var FilterModel = function FilterModel (element) {
        Object.defineProperties(this, {
            element: {
                get: function () { return element; }
            },

            ast: {
                get: function () { return toAST.call(this, false); }
            },
            allAst: {
                get: function () { return toAST.call(this, true); }
            },

            isAll: {
                get: function () { return this.type === 'options' || this.type === 'repeater'; }
            },
            isText: {
                get: function () { return this.type === 'text'; }
            }
        });

        this.type = DEFAULTS.type;
        this.locator = DEFAULTS.locator;
    };

    FilterModel.prototype.types = ['model', 'binding', 'text', 'css', 'options', 'repeater'];

    FilterModel.prototype.setValidValue = function (property, value) {
        this[property] = value || DEFAULTS[property];
    };

    var toAST = function (all) {
        var byIdentifier = ast.createIdentifier('by');
        var locatorLiteral = ast.createLiteral(this.locator);
        if (!all) {
            if (!this.isText) {
                var byMemberExpression = ast.createMemberExpression(byIdentifier, ast.createIdentifier(this.type));
                return ast.createCallExpression(byMemberExpression, [locatorLiteral]);
            } else {
                var cssContainingTextIdentifier = ast.createIdentifier('cssContainingText');
                var byMemberExpression = ast.createMemberExpression(byIdentifier, cssContainingTextIdentifier);
                var allSelectorLiteral = ast.createLiteral('*');
                return ast.createCallExpression(byMemberExpression, [allSelectorLiteral, locatorLiteral]);
            }
        } else {
            var locator = toLiteral(this.locator);
            if (_.isNumber(locator)) {
                return ast.createLiteral(locator);
            } else {
                var elementIdentifier = ast.createIdentifier('element');
                var elementGetTextMemberExpression = ast.createMemberExpression(elementIdentifier, ast.createIdentifier('getText'));
                var getTextCallExpression = ast.createCallExpression(elementGetTextMemberExpression);
                var getTextThenMemberExpression = ast.createMemberExpression(getTextCallExpression, ast.createIdentifier('then'));
                var textIdentifier = ast.createIdentifier('text');
                var textIndexOfMemberExpresion = ast.createMemberExpression(textIdentifier, ast.createIdentifier('indexOf'));
                var textIndexOfCallExpression = ast.createCallExpression(textIndexOfMemberExpresion, [ast.createLiteral(this.locator)]);
                var negativeOneUnaryExpression = ast.createUnaryExpression(ast.UnaryOperators.NEGATION, ast.createLiteral(1), true);
                var textFoundBinaryExpression = ast.createBinaryExpression(ast.BinaryOperators.STRICT_INEQUALITY, textIndexOfCallExpression, negativeOneUnaryExpression)
                var checkFoundTextReturnStatement = ast.createReturnStatement(textFoundBinaryExpression);
                var checkFoundTextBodyBlockStatement = ast.createBlockStatement([checkFoundTextReturnStatement]);
                var checkFoundTextFunctionExpression = ast.createFunctionExpression(null, [textIdentifier], checkFoundTextBodyBlockStatement);
                var getTextThenCallExpression = ast.createCallExpression(getTextThenMemberExpression, [checkFoundTextFunctionExpression]);
                var getTextThenReturnStatement = ast.createReturnStatement(getTextThenCallExpression);
                var getTextThenBodyBlockStatement = ast.createBlockStatement([getTextThenReturnStatement]);
                return ast.createFunctionExpression(null, [elementIdentifier], getTextThenBodyBlockStatement);
            }
        }
    };

    return FilterModel;
};

ComponentEditor.factory('FilterModel', function (ASTCreatorService) {
    return FilterModel(ASTCreatorService);
});
