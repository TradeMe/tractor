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

    function parse (stepDefinition, ast) {
        try {
            var step = new StepModel(stepDefinition);

            var stepCallExpression = ast.expression;
            step.type = parseType(step, stepCallExpression);
            step.regex = parseRegex(step, stepCallExpression);

            var stepFunction = _.last(ast.expression.arguments);
            var statements = stepFunction.body.body;
            var parsers = [parseMock, parseTask, parseExpectation, parsePending, parseMockDone, parseTaskDone];
            tryParse(step, statements, parsers);

            return step;
        } catch (e) {
            console.warn('Invalid step:', ast);
            return null;
        }
    }

    function parseType (step, stepCallExpression) {
        var type = stepCallExpression.callee.property.name;
        assert(_.contains(step.stepTypes, type));
        return type;
    }

    function parseRegex (step, stepCallExpression) {
        var stepRegexArgument = _.first(stepCallExpression.arguments);
        var regex = stepRegexArgument.raw.replace(/^\//, '').replace(/\/$/, '');
        assert(regex);
        return new RegExp(regex);
    }

    function tryParse (step, statements, parsers) {
        statements.map(function (statement) {
            var parsed = parsers.some(function (parser) {
                try {
                    return parser(step, statement);
                } catch (e) { }
            });
            if (!parsed) {
                throw new Error();
            }
        });
    }

    function parseMock (step, statement) {
        var httpBackendOnloadMemberExpression = statement.expression.callee.object.callee;
        assert(httpBackendOnloadMemberExpression.object.name === 'httpBackend');
        assert(httpBackendOnloadMemberExpression.property.name.indexOf('when') === 0);
        var mock = MockParserService.parse(step, statement);
        assert(mock);
        step.mocks.push(mock);
        return true;
    }

    function parseTask (step, statement) {
        var tasksDeclaration = _.first(statement.declarations);
        assert(tasksDeclaration.id.name === 'tasks');
        TaskParserService.parse(step, tasksDeclaration.init);
        return true;
    }

    function parseExpectation (step, statement) {
        var elements = _.first(statement.expression.callee.object.callee.object.arguments).elements;
        _.each(elements, function (element) {
            assert(!(element.name && element.name === 'tasks'));
            var expectation = ExpectationParserService.parse(step, element);
            assert(expectation);
            step.expectations.push(expectation);
        });
        return true;
    }

    function parsePending (step, statement) {
        var callee = statement.expression.callee;
        assert(callee.object.name === 'callback' || callee.object.name === 'done');
        assert(callee.property.name === 'pending');
        return true;
    }

    function parseMockDone (step, statement) {
        assert(statement.expression.callee.name === 'done');
        return true;
    }

    function parseTaskDone (step, statement) {
        assert(statement.expression.callee.object.arguments[0].name === 'done');
        return true;
    }
};

StepDefinitionEditor.service('StepParserService', StepParserService);
