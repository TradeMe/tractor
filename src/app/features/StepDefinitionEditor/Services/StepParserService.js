'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../Services/TaskParserService');
require('../Services/ExpectationParserService');
require('../Models/StepModel');

var StepParserService = function StepParserService (
    TaskParserService,
    ExpectationParserService,
    StepModel
) {
    return {
        parse: parse
    };

    function parse (stepDefinition, astObject) {
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
            var notTasks = false;
            var notExpectations = false;
            var notPending = false;

            try {
                var tasksDeclaration = _.first(statement.declarations);
                assert(tasksDeclaration.id.name === 'tasks');
                TaskParserService.parse(step, tasksDeclaration.init);
            } catch (e) {
                notTasks = true;
            }

            try {
                var expectations = _.first(statement.expression.callee.object.arguments).elements;
                _.each(expectations, function (expectation) {
                    assert(!(expectation.name && expectation.name === 'tasks'));
                    expectation = ExpectationParserService.parse(step, expectation);
                    step.expectations.push(expectation);
                });
            } catch (e) {
                notExpectations = true;
            }

            try {
                assert(statement.expression.callee.object.name === 'callback');
                assert(statement.expression.callee.property.name === 'pending');
            } catch (e) {
                notPending = true;
            }

            if (notTasks && notExpectations && notPending) {
                console.log(statement, index);
            }
        });

        return step;
    }
};

StepDefinitionEditor.service('StepParserService', StepParserService);
