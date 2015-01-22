'use strict';

// Utilities:
var _ = require('lodash');
var toLiteral = require('../../../utilities/toLiteral');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../ComponentEditor/Models/ArgumentModel');

var createExpectationModelConstructor = function (
    ASTCreatorService,
    Argument
) {
    var ast = ASTCreatorService;

    var DEFAULTS = {
        expectation: 'expected'
    };

    var ExpectationModel = function ExpectationModel (step) {
        var component;
        var action;
        var args;

        Object.defineProperties(this, {
            step: {
                get: function () {
                    return step;
                }
            },
            component: {
                get: function () {
                    return component;
                },
                set: function (newComponent) {
                    component = newComponent;
                    this.action = _.first(this.component.component.actions);
                }
            },
            action: {
                get: function () {
                    return action;
                },
                set: function (newAction) {
                    action = newAction;
                    args = parseArguments.call(this);
                }
            },
            arguments: {
                get: function () {
                    return args;
                }
            },
            expectedResult: {
                get: function () {
                    return this.expectedResultLiteral.value;
                },
                set: function (value) {
                    this.expectedResultLiteral.value = value;
                }
            },

            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.component = _.first(this.step.stepDefinition.componentInstances);
        this.expectedResultLiteral = ast.createLiteral(DEFAULTS.expectation);
    };

    return ExpectationModel;

    function toAST () {
        var argumentValues = _.map(this.arguments, function (argument) {
            return argument.ast;
        });

        var actionMemberExpression = ast.createMemberExpression(ast.createIdentifier(this.component.name), this.action.nameIdentifier);
        var actionCallExpression = ast.createCallExpression(actionMemberExpression, argumentValues);
        var expectCallExpression = ast.createCallExpression(ast.createIdentifier('expect'), [actionCallExpression]);
        var toMemberExpression = ast.createMemberExpression(expectCallExpression, ast.createIdentifier('to'));
        var eventuallyMemberExpression = ast.createMemberExpression(toMemberExpression, ast.createIdentifier('eventually'));
        var equalMemberExpression = ast.createMemberExpression(eventuallyMemberExpression, ast.createIdentifier('equal'));

        var expectedResultLiteral = toLiteral(this.expectedResult);
        if (expectedResultLiteral) {
            return ast.createCallExpression(equalMemberExpression, [ast.createLiteral(expectedResultLiteral)]);
        } else {
            return ast.createCallExpression(equalMemberExpression, [this.expectedResultLiteral]);
        }
    }

    function parseArguments () {
        return _.map(this.action.parameters, function (parameter) {
            var argument = new Argument();
            var argumentName = parameter.name;
            argumentName = argumentName.replace(/([A-Z])/g, ' $1');
            argumentName = argumentName.charAt(0).toUpperCase() + argumentName.slice(1).toLowerCase();
            argument.name = argumentName;
            return argument;
        });
    }
};

StepDefinitionEditor.factory('ExpectationModel', function (
    ASTCreatorService,
    ArgumentModel
) {
    return createExpectationModelConstructor(ASTCreatorService, ArgumentModel);
});
