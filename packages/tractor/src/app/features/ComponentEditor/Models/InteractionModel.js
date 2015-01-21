'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./MethodModel');

var InteractionModel = function (
    ASTCreatorService,
    MethodModel
) {
    var ast = ASTCreatorService;

    var InteractionModel = function InteractionModel (action) {
        Object.defineProperties(this, {
            action: {
                get: function () { return action; }
            },
            element: {
                get: function () { return this._element; },
                set: setElement
            },
            method: {
                get: function () { return this._method; },
                set: setMethod
            },
            methodInstance: {
                get: function () { return this._methodInstance; }
            },
            arguments: {
                get: function () { return this._methodInstance.arguments; }
            },
            ast: {
                get: function () { return toAST.call(this); }
            }
        });
    };

    var setElement = function (element) {
        this._element = element;
        this.method = _.first(element.methods);
    };

    var setMethod = function (method) {
        this._method = method;
        this._methodInstance = new MethodModel(this, this.method);
    };

    var toAST = function () {
        var argumentValues = _.map(this.methodInstance.arguments, function (argument) {
            return argument.ast;
        });

        var interactionMemberExpression;
        var elementNameIdentifier = ast.createIdentifier(this.element.name);
        if (this.element.name === 'browser') {
            interactionMemberExpression = ast.createMemberExpression(elementNameIdentifier, this.methodInstance.nameIdentifier);
        } else {
            var thisElementMemberExpression = ast.createMemberExpression(ast.createIdentifier('self'), elementNameIdentifier);
            interactionMemberExpression = ast.createMemberExpression(thisElementMemberExpression, this.methodInstance.nameIdentifier);
        }
        var interactionCallExpression = ast.createCallExpression(interactionMemberExpression, argumentValues);
        var interactionReturnStatement = ast.createReturnStatement(interactionCallExpression);

        if (this.methodInstance.returns !== 'promise') {
            var resolveIdentifier = ast.createIdentifier('resolve');
            var resolveCallExpression = ast.createCallExpression(resolveIdentifier, [interactionCallExpression]);
            var promiseResolverExpressionStatement = ast.createExpressionStatement(resolveCallExpression);
            var promiseResolverBlockStatement = ast.createBlockStatement([promiseResolverExpressionStatement]);
            var promiseResolverFunctionExpression = ast.createFunctionExpression(null, [resolveIdentifier], promiseResolverBlockStatement);
            var promiseIdentifier = ast.createIdentifier('Promise');
            var promiseNewExpression = ast.createNewExpression(promiseIdentifier, [promiseResolverFunctionExpression]);
            interactionReturnStatement.argument = promiseNewExpression;
        }

        this.resultFunctionExpression = ast.createFunctionExpression();

        return interactionReturnStatement;
    };

    return InteractionModel;
};

ComponentEditor.factory('InteractionModel', function (
    ASTCreatorService,
    MethodModel
) {
    return InteractionModel(ASTCreatorService, MethodModel);
});
