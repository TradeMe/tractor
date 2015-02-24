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
        var ast = ASTCreatorService;

        var argumentValues = _.map(this.arguments, function (argument) {
            return argument.ast;
        });

        var taskMemberExpression = ast.memberExpression(ast.identifier(this.component.name), ast.identifier(this.action.name));
        var taskCallExpression = ast.callExpression(taskMemberExpression, argumentValues);
        return ast.expressionStatement(taskCallExpression);
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

StepDefinitionEditor.factory('TaskModel', function (
    ASTCreatorService,
    ArgumentModel
) {
    return createTaskModelConstructor(ASTCreatorService, ArgumentModel);
});
