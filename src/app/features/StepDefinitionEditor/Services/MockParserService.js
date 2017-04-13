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

            mock.action = parseAction(mock, ast);
            mock.url = parseUrl(ast);

            try {
                return parseData(mock, ast);
            } catch (e) { }

            try {
                return parsePassThrough(mock, ast);
            } catch (e) { }

            throw new Error();
        } catch (e) {
            console.warn('Invalid mock:', ast);
            return null;
        }
    }

    function parseAction (mock, ast) {
        var action = ast.callee.property.name.replace(/^when/, '');
        assert(action);
        assert(_.contains(mock.actions, action));
        return action;
    }

    /* The returned url should be the inner contents of the RegExp,
       with all escape sequences removed, so we strip out leading and
       trailing/characters, and any occurences of //. */
    function parseUrl (ast) {
        var rawUrl = _.first(ast.arguments).raw;
        var url = rawUrl.replace(/^\//, '').replace(/\/$/, '').replace(/\\/g,'');
        assert(url);
        return url;
    }

    function parseData (mock, ast) {
        var options = _.last(ast.arguments);
        var body = findOption(options, 'body');
        assert(body);
        var instanceName = body.value.name;
        mock.data = mock.step.stepDefinition.mockDataInstances.find(function (mockDataInstance) {
            return mockDataInstance.variableName === instanceName;
        });
        return mock;
    }

    function parsePassThrough (mock, ast) {
        var options = _.last(ast.arguments);
        var passThrough = findOption(options, 'passThrough');
        assert(passThrough);
        mock.passThrough = passThrough.value.value;
        return mock;
    }

    function findOption (options, key) {
        return options.properties.find(function (property) {
            return property.key.name === key;
        });
    }
};

StepDefinitionEditor.service('MockParserService', MockParserService);
