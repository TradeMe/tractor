'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../../Core/Services/StringToLiteralService');

var createFilterModelConstructor = function (
    astCreatorService,
    stringToLiteralService
) {
    var ast = astCreatorService;

    var FilterModel = function FilterModel (element) {
        Object.defineProperties(this, {
            element: {
                get: function () {
                    return element;
                }
            },

            isGroup: {
                get: function () {
                    return this.type === 'options' || this.type === 'repeater';
                }
            },
            isText: {
                get: function () {
                    return this.type === 'text';
                }
            },

            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.type = _.first(this.types);
        this.locator = '';
    };

    // TODO: I don't like that the user has to know to use
    // 'buttonText' or 'linkText'. We should infer it from
    // the CSS selector.
    FilterModel.prototype.types = ['model', 'binding', 'text', 'css', 'options', 'repeater', 'buttonText', 'linkText'];

    return FilterModel;

    function toAST () {
        if (this.isNested) {
            return toNestedAST.call(this);
        } else {
            return toSingleAST.call(this);
        }
    }

    function toNestedAST () {
        var locatorLiteral = ast.literal(this.locator);
        var template = '';

        var number = stringToLiteralService.toLiteral(locatorLiteral.value);
        if (_.isNumber(number)) {
            return ast.literal(number);
        } else {
            template += '(function (element) {';
            template += '    return element.getText().then(function (text) {';
            template += '        return text.indexOf(<%= locator %>) !== -1;';
            template += '    });';
            template += '});';
            return ast.expression(template, {
                locator: locatorLiteral
            });
        }
    }

    function toSingleAST () {
        var template = '';

        if (!this.isText) {
            var locatorLiteral = ast.literal(this.locator);
            template += 'by.<%= type %>(<%= locator %>)';
            return ast.expression(template, {
                type: ast.identifier(this.type),
                locator: locatorLiteral
            });
        } else {
            // TODO: The comma-separated thing is weird here,
            // it makes the code a bit yuck. Can we just have
            // an extra input?
            var locator = this.locator.split(',');
            var cssLiteral = ast.literal(locator[0].trim());
            var searchStringLiteral = ast.literal(locator[1].trim());
            template += 'by.cssContainingText(<%= cssSelector %>,<%= searchString %>)';
            return ast.expression(template, {
                cssSelector: cssLiteral,
                searchString: searchStringLiteral
            });
        }
    }
};

ComponentEditor.factory('FilterModel', function (
    astCreatorService,
    stringToLiteralService
) {
    return createFilterModelConstructor(astCreatorService, stringToLiteralService);
});
