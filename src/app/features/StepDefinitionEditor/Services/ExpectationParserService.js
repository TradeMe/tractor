'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../Models/ExpectationModel');

var ExpectationParserService = function ExpectationParserService (
    ExpectationModel
) {
    return {
        parse: parse
    };

    function parse (step, ast) {
        try {
            var expectation = new ExpectationModel(step);
            var argument = _.first(ast.arguments);
            expectation.value = argument.raw;

            var expectationCallExpression = _.first(ast.callee.object.object.object.arguments);

            expectation.component = parseComponent(expectation, expectationCallExpression);
            expectation.action = parseAction(expectation, expectationCallExpression);
            expectation.condition = ast.callee.property.name;
            parseArguments(expectation, expectationCallExpression);

            return expectation;
        } catch (e) {
            console.warn('Invalid expectation:', ast);
            return null;
        }
    }

    function parseComponent (expectation, expectationCallExpression) {
        return _.find(expectation.step.stepDefinition.componentInstances, function (componentInstance) {
            return expectationCallExpression.callee.object.name === componentInstance.variableName;
        });
    }

    function parseAction (expectation, expectationCallExpression) {
        return _.find(expectation.component.component.actions, function (action) {
            return expectationCallExpression.callee.property.name === action.variableName;
        });
    }

    function parseArguments (expectation, expectationCallExpression) {
        _.each(expectationCallExpression.arguments, function (argument, index) {
            expectation.arguments[index].value = argument.value;
        });
    }
};

StepDefinitionEditor.service('ExpectationParserService', ExpectationParserService);
