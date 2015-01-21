'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ParameterModel');
require('./InteractionModel');

var ActionModel = function (
    ASTCreatorService,
    ParameterModel,
    InteractionModel
) {
    var ast = ASTCreatorService;

    var DEFAULTS = {
        name: 'action'
    };

    var ActionModel = function ActionModel (component) {
        var interactions = [];
        var parameters = [];

        Object.defineProperties(this, {
            component: {
                get: function () { return component; }
            },
            name: {
                get: function () { return this.nameIdentifier.name; },
                set: function (name) { this.nameIdentifier.name = name; }
            },
            interactions: {
                get: function () { return interactions; }
            },
            parameters: {
                get: function () { return parameters; }
            },
            ast: {
                get: function () { return toAST.call(this); }
            }
        });

        this.nameIdentifier = ast.createIdentifier(this.component.validateName(this, DEFAULTS.name));
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

    ActionModel.prototype.validateName = function (action, name) {
        this.name = this.component.validateName(action, name || DEFAULT_NAME);
    };

    var toAST = function () {
        var prototypeIdentifier = ast.createIdentifier('prototype');
        var prototypeMemberExpression = ast.createMemberExpression(this.component.nameIdentifier, prototypeIdentifier);
        var actionMemberExpression = ast.createMemberExpression(prototypeMemberExpression, this.nameIdentifier);

        var selfIdentifier = ast.createIdentifier('self');
        var thisExpression = ast.createThisExpression();
        var selfVariableDeclarator = ast.createVariableDeclarator(selfIdentifier, thisExpression);
        var selfVariableDeclaration = ast.createVariableDeclaration([selfVariableDeclarator]);

        var interactionASTs = _.map(this.interactions, function (interaction) { return interaction.ast; });
        var firstInteraction = _.first(interactionASTs);

        _.each(_.rest(interactionASTs), function (interactionAST, index) {
            var thenIdentifier = ast.createIdentifier('then');
            var promiseThenMemberExpression = ast.createMemberExpression(firstInteraction.argument, thenIdentifier);

            var previousInteractionMethod = this.interactions[index].method;
            var previousInteractionResultIdentifier;
            if (previousInteractionMethod.returns) {
                var previousInteractionMethodReturns = previousInteractionMethod[previousInteractionMethod.returns];
                if (previousInteractionMethodReturns) {
                    previousInteractionResultIdentifier = ast.createIdentifier(previousInteractionMethodReturns.name);
                }
            }

            var interactionResultFunctionExpression = this.interactions[index + 1].resultFunctionExpression;
            var interactionParameters = previousInteractionResultIdentifier ? [previousInteractionResultIdentifier] : [];
            var interactionBlockStatement = ast.createBlockStatement([interactionAST]);
            interactionResultFunctionExpression.params = interactionParameters;
            interactionResultFunctionExpression.body = interactionBlockStatement;

            firstInteraction.argument = ast.createCallExpression(promiseThenMemberExpression, [interactionResultFunctionExpression]);
        }, this);

        var parameters = _.map(this.parameters, function (parameter) { return parameter.ast; });
        var actionBlockStatement = ast.createBlockStatement([selfVariableDeclaration, firstInteraction]);
        var actionFunctionExpression = ast.createFunctionExpression(null, parameters, actionBlockStatement);

        var actionAssignmentExpression = ast.createAssignmentExpression(actionMemberExpression, ast.AssignmentOperators.ASSIGNMENT, actionFunctionExpression);

        return ast.createExpressionStatement(actionAssignmentExpression);
    };

    return ActionModel;
};

ComponentEditor.factory('ActionModel', function (
    ASTCreatorService,
    ParameterModel,
    InteractionModel
) {
    return ActionModel(ASTCreatorService, ParameterModel, InteractionModel);
});
