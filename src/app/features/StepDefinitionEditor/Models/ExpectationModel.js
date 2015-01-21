'use strict';

// Utilities:
var _ = require('lodash');
var toLiteral = require('../../../utilities/toLiteral');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../ComponentEditor/Models/ArgumentModel');

var ExpectationModel = function (
    ASTCreatorService,
    Argument
) {
    var ast = ASTCreatorService;

    var DEFAULTS = {
        expectation: 'expected',
    };

    var ExpectationModel = function ExpectationModel (step) {
        Object.defineProperties(this, {
            step: {
                get: function () { return step; }
            },
            component: {
                get: function () { return this._component },
                set: setComponent
            },
            action: {
                get: function () { return this._action; },
                set: setAction
            },
            arguments: {
                get: function () { return this._arguments; }
            },
            expectedResult: {
                get: function () { return this.expectedResultLiteral.value; },
                set: function (value) { this.expectedResultLiteral.value = value; }
            },

            ast: {
                get: function () { return toAST.call(this); }
            }
        });

        this.component = _.first(this.step.stepDefinition.componentInstances);
        this.expectedResultLiteral = ast.createLiteral(DEFAULTS.expectation);
    };

    var setComponent = function (component) {
        this._component = component;
        this.action = _.first(this.component.component.actions);
    };

    var setAction = function (action) {
        this._action = action;
        this._arguments = _.map(this.action.parameters, function (parameter) {
            var argument = new Argument();
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
    };

    return ExpectationModel;
};

StepDefinitionEditor.factory('ExpectationModel', function (
    ASTCreatorService,
    ArgumentModel
) {
    return ExpectationModel(ASTCreatorService, ArgumentModel);
});
