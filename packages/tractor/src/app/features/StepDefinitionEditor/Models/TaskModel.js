'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../ComponentEditor/Models/ArgumentModel');

var createTaskModelConstructor = function (
    ASTCreatorService,
    ArgumentModel
) {
    var ast = ASTCreatorService;

    var TaskModel = function TaskModel (step) {
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
        this.action = _.first(this.component.component.actions);
    };

    return TaskModel;

    function toAST () {
        var argumentValues = _.map(this.arguments, function (argument) {
            return argument.ast;
        });

        var taskMemberExpression = ast.createMemberExpression(ast.createIdentifier(this.component.name), this.action.nameIdentifier);
        var taskCallExpression = ast.createCallExpression(taskMemberExpression, argumentValues);
        return ast.createExpressionStatement(taskCallExpression);
    }

    function parseArguments () {
        return _.map(this.action.parameters, function (parameter) {
            var argument = new ArgumentModel();
            var argumentName = parameter.name;
            argumentName = argumentName.replace(/([A-Z])/g, ' $1');
            argumentName = argumentName.charAt(0).toUpperCase() + argumentName.slice(1).toLowerCase();
            argument.name = argumentName;
            return argument;
        });
    }
};

StepDefinitionEditor.factory('TaskModel', function (
    ASTCreatorService,
    ArgumentModel
) {
    return createTaskModelConstructor(ASTCreatorService, ArgumentModel);
});
