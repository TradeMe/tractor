'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../Models/FilterModel');

var FilterParserService = function FilterParserService (FilterModel) {
    return {
        parse: parse
    };

    function parse (element, astObject) {
        var filter = new FilterModel(element);

        var notModelBindingCSSOptionsRepeater = false;
        var notText = false;
        var notAllIndex = false;
        var notAllString = false;

        try {
            assert(astObject.callee.property.name !== 'cssContainingText');
            var locatorLiteral = _.first(astObject.arguments);
            filter.locator = locatorLiteral.value;
            filter.type = astObject.callee.property.name;
        } catch (e) {
            notModelBindingCSSOptionsRepeater = true;
        }

        try {
            if (notModelBindingCSSOptionsRepeater) {
                assert(astObject.callee.property.name === 'cssContainingText');
                var args = astObject.arguments;
                var cssSelector = args[0].value;
                assert(cssSelector);
                var searchString = args[1].value;
                assert(searchString);
                var locatorLiteral = cssSelector + ',' +  searchString;
                filter.locator = locatorLiteral;
                filter.type = 'text';
            }
        } catch (e) {
            notText = true;
        }

        try {
            if (notText) {
                assert(_.isNumber(astObject.value));
                filter.locator = '' + astObject.value;
                filter.type = 'text';
            }
        } catch (e) {
            notAllIndex = true;
        }

        try {
            if (notAllIndex) {
                var getTextThenReturnStatement = _.first(astObject.body.body);
                var checkFoundTextFunctionExpression = _.first(getTextThenReturnStatement.argument.arguments);
                var checkFoundTextReturnStatement = _.first(checkFoundTextFunctionExpression.body.body);
                var locatorLiteral = _.first(checkFoundTextReturnStatement.argument.left.arguments);
                filter.locator = locatorLiteral.value;
                filter.type = 'text';
            }
        } catch (e) {
            notAllString = true;
        }

        if (notModelBindingCSSOptionsRepeater && notText && notAllIndex && notAllString) {
            console.log(astObject);
        }

        return filter;
    }
};

ComponentEditor.service('FilterParserService', FilterParserService);
