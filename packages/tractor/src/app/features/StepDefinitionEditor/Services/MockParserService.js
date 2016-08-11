'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../Models/MockModel');

var MockParserService = function MockParserService (
    MockModel
) {
    return {
        parse: parse
    };

    function parse (step, ast) {
        try {
            var mock = new MockModel(step);

            var mockCallExpression = ast.expression;

            mock.action = parseAction(mock, mockCallExpression);
            mock.url = parseUrl(mock, mockCallExpression);

            try {
                return parseData(mock, mockCallExpression);
            } catch (e) { }

            try {
                return parsePassThrough(mock, mockCallExpression);
            } catch (e) { }

            throw new Error();
        } catch (e) {
            console.warn('Invalid mock:', ast);
            return null;
        }
    }

    function parseAction (mock, mockCallExpression) {
        var action = mockCallExpression.callee.object.callee.property.name.replace(/^when/, '');
        assert(action);
        assert(_.contains(mock.actions, action));
        return action;
    }

    /* The returned url should be the inner contents of the RegExp, 
       with all escape sequences removed, so we strip out leading and
       trailing/characters, and any occurences of //. */
    function parseUrl (mock, mockCallExpression) {
        var rawUrl = _.last(mockCallExpression.callee.object.arguments).raw; 
        var url = rawUrl.replace(/^\//, '').replace(/\/$/, '').replace(/\\/g,''); 
        assert(url);
        return url;  
    }

    function parseData (mock, mockCallExpression) {
        var instanceName = _.first(mockCallExpression.arguments).name;
        mock.data = _.find(mock.step.stepDefinition.mockDataInstances, function (mockDataInstance) {
            return mockDataInstance.variableName === instanceName;
        });
        return mock;
    }

    function parsePassThrough (mock, mockCallExpression) {
        assert(mockCallExpression.callee.property.name === 'passThrough');
        mock.passThrough = true;
        return mock;
    }
};

StepDefinitionEditor.service('MockParserService', MockParserService);
