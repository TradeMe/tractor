'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./MethodModel');

var createInteractionModelConstructor = function (
    ASTCreatorService,
    MethodModel
) {
    var ast = ASTCreatorService;

    var InteractionModel = function InteractionModel (action) {
        var element;
        var method;
        var methodInstance;

        Object.defineProperties(this, {
            action: {
                get: function () {
                    return action;
                }
            },
            element: {
                get: function () {
                    return element;
                },
                set: function (newElement) {
                    element = newElement;
                    this.method = _.first(element.methods);
                }
            },
            method: {
                get: function () {
                    return method;
                },
                set: function (newMethod) {
                    method = newMethod;
                    methodInstance = new MethodModel(this, this.method);
                }
            },
            methodInstance: {
                get: function () {
                    return methodInstance;
                }
            },
            arguments: {
                get: function () {
                    return methodInstance.arguments;
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });
    };

    return InteractionModel;

    function toAST () {
        var argumentValues = _.map(this.methodInstance.arguments, function (argument) {
            return argument.ast;
        });

        var interactionMemberExpression;
        var elementNameIdentifier = ast.identifier(this.element.variableName);
        var methodInstanceNameIdentifier = ast.identifier(this.methodInstance.name);
        if (this.element.name === 'browser') {
            interactionMemberExpression = ast.memberExpression(elementNameIdentifier, methodInstanceNameIdentifier);
        } else {
            var thisElementMemberExpression = ast.memberExpression(ast.identifier('self'), elementNameIdentifier);
            interactionMemberExpression = ast.memberExpression(thisElementMemberExpression, methodInstanceNameIdentifier);
        }
        var interactionCallExpression = ast.callExpression(interactionMemberExpression, argumentValues);
        var interactionReturnStatement = ast.returnStatement(interactionCallExpression);

        if (this.methodInstance.returns !== 'promise') {
            var resolveIdentifier = ast.identifier('resolve');
            var resolveCallExpression = ast.callExpression(resolveIdentifier, [interactionCallExpression]);
            var promiseResolverExpressionStatement = ast.expressionStatement(resolveCallExpression);
            var promiseResolverBlockStatement = ast.blockStatement([promiseResolverExpressionStatement]);
            var promiseResolverFunctionExpression = ast.functionExpression(null, [resolveIdentifier], promiseResolverBlockStatement);
            var promiseIdentifier = ast.identifier('Promise');
            var promiseNewExpression = ast.newExpression(promiseIdentifier, [promiseResolverFunctionExpression]);
            interactionReturnStatement.argument = promiseNewExpression;
        }

        this.resultFunctionExpression = ast.functionExpression();

        return interactionReturnStatement;
    }
};

ComponentEditor.factory('InteractionModel', function (
    ASTCreatorService,
    MethodModel
) {
    return createInteractionModelConstructor(ASTCreatorService, MethodModel);
});
