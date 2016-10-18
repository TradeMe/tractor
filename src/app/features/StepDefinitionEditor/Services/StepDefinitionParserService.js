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

    function parse (stepDefinitionFile, availableComponents, availableMockData) {
        try {
            var ast = stepDefinitionFile.ast;
            var meta = JSON.parse(_.first(ast.comments).value);

            var stepDefinition = new StepDefinitionModel({
                availableComponents: availableComponents,
                availableMockData: availableMockData,
                url: stepDefinitionFile.url
            });
            stepDefinition.name = meta.name;

            var module = _.first(ast.body);
            var statements = module.expression.right.body.body;

            var parsers = [parseComponent, parseMock, parseStep];
            tryParse(stepDefinition, statements, meta, parsers);

            return stepDefinition;
        } catch (e) {
            console.warn('Invalid step definition:', stepDefinitionFile.ast);
            return null;
        }
    }

    function tryParse (stepDefinition, statements, meta, parsers) {
        statements.map(function (statement) {
            var parsed = parsers.some(function (parser) {
                try {
                    return parser(stepDefinition, statement, meta);
                } catch (e) { }
            });
            if (!parsed) {
                throw new Error();
            }
        });
    }

    function parseComponent (stepDefinition, statement, meta) {
        var declarator = _.last(statement.declarations);
        var name = declarator.init.callee.name;
        assert(name !== 'require');
        stepDefinition.addComponent(meta.components[stepDefinition.components.length].name);
        return true;
    }

    function parseMock (stepDefinition, statement, meta) {
        var declarator = _.first(statement.declarations);
        var name = declarator.init.callee.name;
        assert(name === 'require');
        var path = _.first(declarator.init.arguments);
        assert(path.value.match(/\.mock.json$/));
        stepDefinition.addMock(meta.mockData[stepDefinition.mockData.length].name);
        return true;
    }

    function parseStep (stepDefinition, statement) {
        var step = StepParserService.parse(stepDefinition, statement);
        assert(step);
        stepDefinition.step = step;
        return true;
    }
};

StepDefinitionEditor.service('StepDefinitionParserService', StepDefinitionParserService);
