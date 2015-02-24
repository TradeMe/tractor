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

    function parse (step, astObject) {
        _.each(astObject.body, function (statement, index) {
            try {
                var mock = new MockModel(step.httpBackendSetupTask);

                var action = _.first(statement.expression.callee.object.arguments).value;
                var url = _.last(statement.expression.callee.object.arguments).value;
                assert(_.contains(mock.actions, action));

                mock.action = action;
                mock.url = url;

                var instanceName = _.first(statement.expression.arguments).name;
                step.data = _.find(step.stepDefinition.mockDataInstances, function (mockDataInstance) {
                    return mockDataInstance.name === instanceName;
                });

                step.httpBackendSetupTask.mocks.push(mock);
            } catch (e) {
                console.log(statement, index);
            }
        });
    }
};

StepDefinitionEditor.service('MockParserService', MockParserService);
