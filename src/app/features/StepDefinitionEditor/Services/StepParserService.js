'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../Services/MockParserService');
require('../Services/TaskParserService');
require('../Services/ExpectationParserService');
require('../Models/StepModel');

var StepParserService = function StepParserService (
    MockParserService,
    TaskParserService,
    ExpectationParserService,
    StepModel
) {
    return {
        parse: parse
    };

    function parse (stepDefinition, astObject) {
        try {
            var step = new StepModel(stepDefinition);

            var type = astObject.expression.callee.property.name;
            var stepRegexArgument = _.first(astObject.expression.arguments);
            var regex = stepRegexArgument.raw.replace(/^\//, '').replace(/\/$/, '');
            assert(_.contains(step.stepTypes, type));
            assert(regex);
            step.type = type;
            step.regex = new RegExp(regex);

            var stepFunction = _.last(astObject.expression.arguments);

            _.each(stepFunction.body.body, function (statement, index) {
                try {
                    var httpBackendOnloadMemberExpression = statement.expression.callee.object.callee.object;
                    assert(httpBackendOnloadMemberExpression.object.name === 'httpBackend');
                    assert(httpBackendOnloadMemberExpression.property.name === 'onLoad');
                    var mock = MockParserService.parse(step, statement);
                    assert(mock);
                    step.mocks.push(mock);
                    return;
                } catch (e) { }

                try {
                    var tasksDeclaration = _.first(statement.declarations);
                    assert(tasksDeclaration.id.name === 'tasks');
                    TaskParserService.parse(step, tasksDeclaration.init);
                    return;
                } catch (e) { }

                try {
                    var expectations = _.first(statement.expression.callee.object.arguments).elements;
                    _.each(expectations, function (expectation) {
                        assert(!(expectation.name && expectation.name === 'tasks'));
                        expectation = ExpectationParserService.parse(step, expectation);
                        assert(expectation);
                        step.expectations.push(expectation);
                    });
                    return;
                } catch (e) { }

                try {
                    assert(statement.expression.callee.object.name === 'callback');
                    assert(statement.expression.callee.property.name === 'pending');
                    return;
                } catch (e) { }

                try {
                    assert(statement.expression.callee.name === 'done');
                    return;
                } catch (e) { }

                console.warn('Invalid "StepModel"', statement, index);
            });

            return step;
        } catch (e) {
            return null;
        }
    }
};

StepDefinitionEditor.service('StepParserService', StepParserService);
