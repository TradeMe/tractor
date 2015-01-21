'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../ComponentEditor/Models/ArgumentModel');

var TaskModel = function (
    ASTCreatorService,
    ArgumentModel
) {
    var ast = ASTCreatorService;

    var TaskModel = function TaskModel (step) {
        Object.defineProperties(this, {
            step: {
                get: function () { return step; }
            },
            component: {
                get: function () { return this._component; },
                set: setComponent
            },
            action: {
                get: function () { return this._action; },
                set: setAction
            },
            arguments: {
                get: function () { return this._arguments; }
            },
            ast: {
                get: function () { return toAST.call(this); }
            }
        });

        this.component = _.first(this.step.stepDefinition.componentInstances);
        this.action = _.first(this.component.component.actions);
    };

    var setComponent = function (component) {
        this._component = component;
        this.action = _.first(this.component.component.actions);
    };

    var setAction = function (action) {
        this._action = action;
        this._arguments = _.map(this.action.parameters, function (parameter) {
            var argument = new ArgumentModel();
            var argumentName = parameter.name;
            argumentName = argumentName.replace(/([A-Z])/g, ' $1');
            argumentName = argumentName.charAt(0).toUpperCase() + argumentName.slice(1).toLowerCase();
            argument.name = argumentName;
            return argument;
        });
    };

    var toAST = function () {
        var argumentValues = _.map(this.arguments, function (argument) {
            return argument.ast;
        });

        var taskMemberExpression = ast.createMemberExpression(ast.createIdentifier(this.component.name), this.action.nameIdentifier);
        var taskCallExpression = ast.createCallExpression(taskMemberExpression, argumentValues);
        return ast.createExpressionStatement(taskCallExpression);
    };

    return TaskModel;
};

StepDefinitionEditor.factory('TaskModel', function (
    ASTCreatorService,
    ArgumentModel
) {
    return TaskModel(ASTCreatorService, ArgumentModel);
});
