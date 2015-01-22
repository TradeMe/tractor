'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../Services/FilterParserService');
require('../Models/ElementModel');

var ElementParserService = function ElementParserService (
    FilterParserService,
    ElementModel
) {
    return {
        parse: parse
    };

    function parse (component, astObject, element) {
        if (!element) {
            element = new ElementModel(component);
            element.name = astObject.expression.left.property.name;
        }

        var elementCallExpression = astObject.expression.right;
        var elementCallExpressionCallee = elementCallExpression.callee;

        try {
            assert(elementCallExpressionCallee.object.callee);
            try {
                assert(elementCallExpressionCallee.object.callee.property.name === 'filter');
                elementCallExpressionCallee = elementCallExpressionCallee.object.callee;
                elementCallExpression = elementCallExpression.callee.object;
            } catch (e) { }

            parse(component, {
                expression: {
                    right: elementCallExpressionCallee.object
                }
            }, element);
        } catch (e) { }

        var notFirstElementBy = false;
        var notFirstElementAllBy = false;
        var notElementBy = false;
        var notElementAllBy = false;
        var notElementFilter = false;
        var notElementGet = false;

        try {
            assert(elementCallExpressionCallee.name === 'element');
            var filterAST = _.first(elementCallExpression.arguments);
            var filter = FilterParserService.parse(element, filterAST);
            element.filters.push(filter);
        } catch (e) {
            notFirstElementBy = true;
        }

        try {
            if (notFirstElementBy) {
                assert(elementCallExpressionCallee.object.name === 'element');
                assert(elementCallExpressionCallee.property.name === 'all');
                var filterAllAST = _.first(elementCallExpression.arguments);
                var filter = FilterParserService.parse(element, filterAllAST);
                element.filters.push(filter);
            }
        } catch (e) {
            notFirstElementAllBy = true;
        }

        try {
            if (notFirstElementAllBy) {
                assert(elementCallExpressionCallee.property.name === 'element');
                var filterAST = _.first(elementCallExpression.arguments);
                var filter = FilterParserService.parse(element, filterAST);
                element.filters.push(filter);
            }
        } catch (e) {
            notElementBy = true;
        }

        try {
            if (notElementBy) {
                assert(elementCallExpressionCallee.property.name === 'all');
                var filterAllAST = _.first(elementCallExpression.arguments);
                var filter = FilterParserService.parse(element, filterAllAST);
                element.filters.push(filter);
            }
        } catch (e) {
            notElementAllBy = true;
        }

        try {
            if (notElementAllBy) {
                assert(elementCallExpressionCallee.property.name === 'filter');
                var filterAST = _.first(elementCallExpression.arguments);
                var filter = FilterParserService.parse(element, filterAST);
                element.filters.push(filter);
            }
        } catch (e) {
            notElementFilter = true;
        }

        try {
            if (notElementFilter) {
                assert(elementCallExpressionCallee.property.name === 'get');
                var filterAST = _.first(elementCallExpression.arguments);
                var filter = FilterParserService.parse(element, filterAST);
                element.filters.push(filter);
            }
        } catch (e) {
            notElementGet = true;
        }

        if (notFirstElementBy && notFirstElementAllBy && notElementBy && notElementAllBy && notElementFilter && notElementGet) {
            console.log(astObject);
        }

        return element;
    }
};

ComponentEditor.service('ElementParserService', ElementParserService);
