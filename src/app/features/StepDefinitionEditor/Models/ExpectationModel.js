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
    astCreatorService,
    stringToLiteralService,
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
        this.condition = _.first(this.conditions);
        this.value = '';
    };

    ExpectationModel.prototype.conditions = ['equal', 'contain'];

    return ExpectationModel;

    function toAST () {
        var ast = astCreatorService;

        var template = 'expect(<%= component %>.<%= action %>(%= expectationArguments %)).to.eventually.<%= condition %>(<%= expectedResult %>); ';

        var expectationArguments = this.arguments.map(function (argument) {
            return argument.ast;
        });
        var expectedResult = ast.literal(stringToLiteralService.toLiteral(this.value) || this.value);

        return ast.template(template, {
            component: ast.identifier(this.component.variableName),
            action: ast.identifier(this.action.variableName),
            expectationArguments: expectationArguments,
            condition: ast.identifier(this.condition),
            expectedResult: expectedResult
        }).expression;
    }

    function parseArguments () {
        return this.action.parameters.map(function (parameter) {
            return new ArgumentModel(null, {
                name: parameter.name
            });
        });
    }
};

StepDefinitionEditor.factory('ExpectationModel', function (
    astCreatorService,
    stringToLiteralService,
    ArgumentModel
) {
    return createExpectationModelConstructor(astCreatorService, stringToLiteralService, ArgumentModel);
});
