'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
var camelcase = require('change-case').camel;
require('../../../Core/Services/ASTCreatorService');
require('./ParameterModel');
require('./InteractionModel');

var createActionModelConstructor = function (
    ASTCreatorService,
    ParameterModel,
    InteractionModel
) {
    var ActionModel = function ActionModel (component) {
        var interactions = [];
        var parameters = [];

        Object.defineProperties(this, {
            component: {
                get: function () {
                    return component;
                }
            },
            interactions: {
                get: function () {
                    return interactions;
                }
            },
            parameters: {
                get: function () {
                    return parameters;
                }
            },
            variableName: {
                get: function () {
                    return camelcase(this.name);
                }
            },
            meta: {
                get: function () {
                    return {
                        name: this.name,
                        parameters: this.parameters.map(function (parameter) { return parameter.meta; })
                    };
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.name = '';
    };

    ActionModel.prototype.addParameter = function () {
        this.parameters.push(new ParameterModel(this));
    };

    ActionModel.prototype.removeParameter = function (parameter) {
        _.remove(this.parameters, parameter);
    };

    ActionModel.prototype.addInteraction = function () {
        var interaction = new InteractionModel(this);
        interaction.element = this.component.browser;
        this.interactions.push(interaction);
    };

    ActionModel.prototype.removeInteraction = function (interaction) {
        _.remove(this.interactions, interaction);
    };

    ActionModel.prototype.getAllVariableNames = function () {
        return this.component.getAllVariableNames(this);
    };

    return ActionModel;

    function toAST () {
        var ast = ASTCreatorService;
        var prototypeIdentifier = ast.identifier('prototype');
        var prototypeMemberExpression = ast.memberExpression(ast.identifier(this.component.variableName), prototypeIdentifier);
        var actionMemberExpression = ast.memberExpression(prototypeMemberExpression, ast.identifier(this.variableName));

        var selfIdentifier = ast.identifier('self');
        var thisExpression = ast.thisExpression();
        var selfVariableDeclarator = ast.variableDeclarator(selfIdentifier, thisExpression);
        var selfVariableDeclaration = ast.variableDeclaration([selfVariableDeclarator]);

        var interactionASTs = _.map(this.interactions, function (interaction) {
            return interaction.ast;
        });
        var firstInteraction = _.first(interactionASTs);

        _.each(_.rest(interactionASTs), function (interactionAST, index) {
            var thenIdentifier = ast.identifier('then');
            var promiseThenMemberExpression = ast.memberExpression(firstInteraction.argument, thenIdentifier);

            var previousInteractionMethod = this.interactions[index].method;
            var previousInteractionResultIdentifier;
            if (previousInteractionMethod.returns) {
                var previousInteractionMethodReturns = previousInteractionMethod[previousInteractionMethod.returns];
                if (previousInteractionMethodReturns) {
                    previousInteractionResultIdentifier = ast.identifier(previousInteractionMethodReturns.name);
                }
            }

            var interactionResultFunctionExpression = this.interactions[index + 1].resultFunctionExpression;
            var interactionParameters = previousInteractionResultIdentifier ? [previousInteractionResultIdentifier] : [];
            var interactionBlockStatement = ast.blockStatement([interactionAST]);
            interactionResultFunctionExpression.params = interactionParameters;
            interactionResultFunctionExpression.body = interactionBlockStatement;

            firstInteraction.argument = ast.callExpression(promiseThenMemberExpression, [interactionResultFunctionExpression]);
        }, this);

        var parameters = _.map(this.parameters, function (parameter) {
            return parameter.ast;
        });
        var actionBlockStatement = ast.blockStatement([selfVariableDeclaration, firstInteraction]);
        var actionFunctionExpression = ast.functionExpression(null, parameters, actionBlockStatement);

        var actionAssignmentExpression = ast.assignmentExpression(actionMemberExpression, ast.AssignmentOperators.ASSIGNMENT, actionFunctionExpression);

        return ast.expressionStatement(actionAssignmentExpression);
    }
};

ComponentEditor.factory('ActionModel', function (
    ASTCreatorService,
    ParameterModel,
    InteractionModel
) {
    return createActionModelConstructor(ASTCreatorService, ParameterModel, InteractionModel);
});
