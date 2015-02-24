'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../../Core/Services/StringToLiteralService');
require('../../ComponentEditor/Models/ArgumentModel');

var createExpectationModelConstructor = function (
    ASTCreatorService,
    StringToLiteralService,
    ArgumentModel
) {
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
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.component = _.first(this.step.stepDefinition.componentInstances);
        this.expectedResult = '';
    };

    return ExpectationModel;

    function toAST () {
        debugger;
        var ast = ASTCreatorService;

        var argumentValues = _.map(this.arguments, function (argument) {
            return argument.ast;
        });

        var actionMemberExpression = ast.memberExpression(ast.identifier(this.component.name), ast.identifier(this.action.name));
        var actionCallExpression = ast.callExpression(actionMemberExpression, argumentValues);
        var expectCallExpression = ast.callExpression(ast.identifier('expect'), [actionCallExpression]);
        var toMemberExpression = ast.memberExpression(expectCallExpression, ast.identifier('to'));
        var eventuallyMemberExpression = ast.memberExpression(toMemberExpression, ast.identifier('eventually'));
        var equalMemberExpression = ast.memberExpression(eventuallyMemberExpression, ast.identifier('equal'));

        var expectedResultLiteral = StringToLiteralService.toLiteral(this.expectedResult);
        if (expectedResultLiteral) {
            return ast.callExpression(equalMemberExpression, [ast.literal(expectedResultLiteral)]);
        } else {
            return ast.callExpression(equalMemberExpression, [ast.literal(this.expectedResult)]);
        }
    }

    function parseArguments () {
        return _.map(this.action.parameters, function (parameter) {
            var name = parameter.name;
            name = name.replace(/([A-Z])/g, ' $1');
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            return new ArgumentModel(null, { name: name });
        });
    }
};

StepDefinitionEditor.factory('ExpectationModel', function (
    ASTCreatorService,
    StringToLiteralService,
    ArgumentModel
) {
    return createExpectationModelConstructor(ASTCreatorService, StringToLiteralService, ArgumentModel);
});
