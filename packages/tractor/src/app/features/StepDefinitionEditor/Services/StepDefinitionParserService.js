'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../Services/StepParserService');
require('../Models/StepDefinitionModel');

var StepDefinitionParserService = function StepDefinitionParserService (
    StepParserService,
    StepDefinitionModel
) {
    return {
        parse: parse
    };

    function parse (astObject, fileName, availableComponents) {
        var stepDefinition = new StepDefinitionModel(fileName, availableComponents);

        var module = _.first(astObject.body);
        var moduleBody = module.expression.right.body.body;

        _.each(moduleBody, function (statement, index) {
            var notStepDefinition = false;
            var notComponentConstructorRequire = false;
            var notComponent = false;

            try {
                var step = StepParserService.parse(stepDefinition, statement);
                assert(step);
                stepDefinition.step = step;
            } catch (e) {
                notStepDefinition = true;
            }

            var declarator;
            var name;

            try {
                if (notStepDefinition) {
                    declarator = _.first(statement.declarations);
                    name = declarator.init.callee.name;
                    assert(name === 'require');
                }
            } catch (e) {
                notComponentConstructorRequire = true;
            }

            try {
                if (notComponentConstructorRequire) {
                    declarator = _.first(statement.declarations);
                    name = declarator.init.callee.name;
                    assert(name !== 'require');
                    stepDefinition.addComponent(name);
                }
            } catch (e) {
                notComponent = true;
            }

            if (notStepDefinition && notComponentConstructorRequire && notComponent) {
                console.log(statement, index);
            }
        });

        return stepDefinition;
    }
};

StepDefinitionEditor.service('StepDefinitionParserService', StepDefinitionParserService);
