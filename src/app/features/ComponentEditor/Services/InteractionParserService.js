'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('./ArgumentParserService');
require('../Models/InteractionModel');

var InteractionParserService = function InteractionParserService (
    ArgumentParserService,
    InteractionModel
) {
    return {
        parse: parse
    };

    function parse (action, astObject) {
        var interaction = new InteractionModel(action);

        var notFirstWrappedPromiseInteraction = false;
        var notFirstOwnPromiseInteraction = false;
        var notWrappedPromiseInteraction = false;
        var notOwnPromiseInteraction = false;
        var notValidInteraction = false;

        try {
            assert(astObject.argument.callee.object.callee);
            parse(action, {
                argument: astObject.argument.callee.object
            });
        } catch (e) { }

        var interactionCallExpression;

        try {
            var wrappedThenFunctionExpression = _.first(astObject.argument.arguments);
            var interactionResolveExpressionStatement = _.first(wrappedThenFunctionExpression.body.body);
            interactionCallExpression = _.first(interactionResolveExpressionStatement.expression.arguments);
        } catch (e) {
            notFirstWrappedPromiseInteraction = true;
        }

        try {
            if (notFirstWrappedPromiseInteraction) {
                interactionCallExpression = astObject.argument;
                assert(!interactionCallExpression.callee.object.callee);
            }
        } catch (e) {
            notFirstOwnPromiseInteraction = true;
        }

        try {
            if (notFirstOwnPromiseInteraction) {
                var wrappedThenFunctionExpression = _.first(astObject.argument.arguments);
                interaction.resultFunctionExpression = wrappedThenFunctionExpression;
                var wrappedNewPromiseReturnStatement = _.first(wrappedThenFunctionExpression.body.body);
                var wrappedResolveFunctionExpression = _.first(wrappedNewPromiseReturnStatement.argument.arguments);
                var interactionResolveExpressionStatement = _.first(wrappedResolveFunctionExpression.body.body);
                interactionCallExpression = _.first(interactionResolveExpressionStatement.expression.arguments);
            }
        } catch (e) {
            notWrappedPromiseInteraction = true;
        }

        try {
            if (notWrappedPromiseInteraction) {
                var wrappedThenFunctionExpression = _.first(astObject.argument.arguments);
                interaction.resultFunctionExpression = wrappedThenFunctionExpression;
                var interactionReturnStatement = _.first(wrappedThenFunctionExpression.body.body);
                interactionCallExpression = interactionReturnStatement.argument;
            }
        } catch (e) {
            notOwnPromiseInteraction = true;
        }

        try {
            if (interactionCallExpression.callee.object.name === 'browser') {
                interaction.element = action.component.browser;
            } else {
                interaction.element = _.find(action.component.elements, function (element) {
                    return element.name === interactionCallExpression.callee.object.property.name;
                });
            }
            assert(interaction.element);
            interaction.method = _.find(interaction.element.methods, function (elementAction) {
                return elementAction.name === interactionCallExpression.callee.property.name;
            });
            assert(interaction.method);
            var args = _.map(interactionCallExpression.arguments, function (argument, index) {
                var arg = ArgumentParserService.parse(interaction.methodInstance, interaction.method.arguments[index], argument);
                assert(arg);
                return arg;
            });
            interaction.methodInstance.arguments = args;
            action.interactions.push(interaction);
        } catch (e) {
            notValidInteraction = true;
        }

        if (notFirstWrappedPromiseInteraction && notFirstOwnPromiseInteraction && notWrappedPromiseInteraction && notOwnPromiseInteraction && notValidInteraction) {
            console.log(astObject);
        }
    }
};

ComponentEditor.service('InteractionParserService', InteractionParserService);
