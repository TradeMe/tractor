'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
var ucFirst = require('change-case').ucFirst;
require('../Services/StepParserService');
require('../Models/StepDefinitionModel');

var StepDefinitionParserService = function StepDefinitionParserService (
    StepParserService,
    StepDefinitionModel
) {
    return {
        parse: parse
    };

    function parse (astObject, fileName, availableComponents, availableMockData) {
        var stepDefinition = new StepDefinitionModel(fileName, availableComponents, availableMockData);

        var module = _.first(astObject.body);
        var moduleBody = module.expression.right.body.body;

        _.each(moduleBody, function (statement, index) {
            var notStepDefinition = false;
            var notComponentConstructorRequire = false;
            var notComponent = false;
            var notMockDataRequire = false;

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
                    var path = _.first(declarator.init.arguments);
                    assert(path.value.match(/\.component$/));
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

            try {
                if (notComponent) {
                    declarator = _.first(statement.declarations);
                    name = declarator.id.name;
                    var path = _.first(declarator.init.arguments);
                    assert(path.value.match(/\.mock.json$/));
                    stepDefinition.addMock(ucFirst(name));
                }
            } catch (e) {
                notComponentConstructorRequire = true;
            }

            if (notStepDefinition && notComponentConstructorRequire && notComponent && notMockDataRequire) {
                console.log(statement, index);
            }
        });

        return stepDefinition;
    }
};

StepDefinitionEditor.service('StepDefinitionParserService', StepDefinitionParserService);
