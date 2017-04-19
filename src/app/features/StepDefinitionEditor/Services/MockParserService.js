'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('./HeaderParserService');
require('../Models/MockModel');

var MockParserService = function MockParserService (
    HeaderParserService,
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
                parsePassThrough(mock, ast);
                return mock;
            } catch (e) { }

            try {
                parseData(mock, ast);
                parseStatus(mock, ast);
                parseHeaders(mock, ast);
                return mock;
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
        var bodyOption = findOption(options, 'body');
        assert(bodyOption);
        var instanceName = bodyOption.value.name;
        var data = mock.step.stepDefinition.mockDataInstances.find(function (mockDataInstance) {
            return mockDataInstance.variableName === instanceName;
        });
        assert(data);
        mock.data = data;
    }

    function parsePassThrough (mock, ast) {
        var options = _.last(ast.arguments);
        var passThroughOption = findOption(options, 'passThrough');
        assert(passThroughOption);
        var passThrough = passThroughOption.value.value;
        mock.passThrough = !!passThrough;
    }

    function parseStatus (mock, ast) {
        var options = _.last(ast.arguments);
        var statusOption = findOption(options, 'status');
        if (statusOption) {
            var status = statusOption.value.value;
            mock.status = status;
        }
    }

    function parseHeaders (mock, ast) {
        var options = _.last(ast.arguments);
        var headersOption = findOption(options, 'headers');
        if (headersOption) {
            headersOption.value.properties.forEach(function (property) {
                var header = HeaderParserService.parse(mock, property);
                assert(header);
                mock.headers.push(header);
            });
        }
    }

    function findOption (options, key) {
        return options.properties.find(function (property) {
            return property.key.name === key;
        });
    }
};

StepDefinitionEditor.service('MockParserService', MockParserService);
