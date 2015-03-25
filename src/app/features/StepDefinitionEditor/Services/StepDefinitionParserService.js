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

    function parse (stepDefinitionFile, components, mockData) {
        try {
            debugger;
            var stepDefinition = new StepDefinitionModel(stepDefinitionFile.name, {
                availableComponents: components,
                availableMockData: mockData,
                path: stepDefinitionFile.path
            });

            var ast = stepDefinitionFile.ast;
            var meta = JSON.parse(_.first(ast.comments).value);

            var module = _.first(ast.body);
            var moduleBody = module.expression.right.body.body;

            _.each(moduleBody, function (statement, index) {
                try {
                    var step = StepParserService.parse(stepDefinition, statement);
                    assert(step);
                    stepDefinition.step = step;
                    return;
                } catch (e) { }

                var declarator;
                var name;

                try {
                    declarator = _.first(statement.declarations);
                    name = declarator.init.callee.name;
                    var path = _.first(declarator.init.arguments);
                    assert(path.value.match(/\.component$/));
                    assert(name === 'require');
                    return;
                } catch (e) { }

                try {
                    declarator = _.first(statement.declarations);
                    name = declarator.init.callee.name;
                    assert(name !== 'require');
                    stepDefinition.addComponent(meta.components[stepDefinition.components.length].name);
                    return;
                } catch (e) { }

                try {
                    declarator = _.first(statement.declarations);
                    name = declarator.id.name;
                    var path = _.first(declarator.init.arguments);
                    assert(path.value.match(/\.mock.json$/));
                    stepDefinition.addMock(meta.mockData[stepDefinition.mockData.length].name);
                    return;
                } catch (e) { }

                console.warn('Invalid step definition', statement, index);
            });

            return stepDefinition;
        } catch (e) {
            return null;
        }
    }
};

StepDefinitionEditor.service('StepDefinitionParserService', StepDefinitionParserService);
