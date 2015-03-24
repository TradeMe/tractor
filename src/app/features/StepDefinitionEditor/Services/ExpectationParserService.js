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

    function parse (step, astObject) {
        var expectation = new ExpectationModel(step);

        expectation.value = _.first(astObject.arguments).value;

        var actionCallExpression = _.first(astObject.callee.object.object.object.arguments);

        expectation.component = _.find(expectation.step.stepDefinition.componentInstances, function (componentInstance) {
            return componentInstance.name === actionCallExpression.callee.object.name;
        });

        expectation.action = _.find(expectation.component.component.actions, function (action) {
            return action.name === actionCallExpression.callee.property.name;
        });

        _.each(actionCallExpression.arguments, function (argument, index) {
            expectation.arguments[index].value = argument.value;
        });

        return expectation;
    }
};

StepDefinitionEditor.service('ExpectationParserService', ExpectationParserService);
