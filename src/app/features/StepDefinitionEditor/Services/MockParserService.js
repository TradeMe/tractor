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

    function parse (step, statement) {
        try {
            var mock = new MockModel(step);

            var action = _.first(statement.expression.callee.object.arguments).value;
            var url = _.last(statement.expression.callee.object.arguments).value;

            assert(action);
            assert(url);
            assert(_.contains(mock.actions, action));

            mock.action = action;
            mock.url = url;

            try {
                var instanceName = _.first(statement.expression.arguments).name;
                mock.data = _.find(step.stepDefinition.mockDataInstances, function (mockDataInstance) {
                    return mockDataInstance.variableName === instanceName;
                });
                return mock;
            } catch (e) { }

            try {
                assert(statement.expression.callee.property.name === 'passThrough');
                mock.passThrough = true;
                return mock;
            } catch (e) { }

            console.warn('Invalid "MockModel"', statement);
        } catch (e) {
            return null;
        }
    }
};

StepDefinitionEditor.service('MockParserService', MockParserService);
