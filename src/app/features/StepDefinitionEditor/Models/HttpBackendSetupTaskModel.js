'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./MockModel');

var createHttpBackendSetupTaskModelConstructor = function (
    ASTCreatorService,
    MockModel
) {
    var HttpBackendSetupTaskModel = function HttpBackendSetupTaskModel (step) {
        var mocks = [];

        Object.defineProperties(this, {
            step: {
                get: function () {
                    return step;
                }
            },
            mocks: {
                get: function () {
                    return mocks;
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });
    };

    HttpBackendSetupTaskModel.prototype.addMock = function () {
        this.mocks.push(new MockModel(this));
    };

    HttpBackendSetupTaskModel.prototype.removeMock = function (mock) {
        _.remove(this.mocks, mock);
    };

    return HttpBackendSetupTaskModel;

    function toAST () {
        var ast = ASTCreatorService;

        var httpBackendIdentifier = ast.identifier('httpBackend');
        var mockASTs = _.map(this.mocks, function (mock) {
            return mock.ast;
        });

        _.each(MockModel.prototype.actions, function (action) {
            var httpBackendWhenMemberExpression = ast.memberExpression(httpBackendIdentifier, ast.identifier('when'));
            var httpBackendWhenCallExpression = ast.callExpression(httpBackendWhenMemberExpression, [ast.literal(action), ast.literal(/.*/)]);
            var httpBackendPassThroughMemberExpression = ast.memberExpression(httpBackendWhenCallExpression, ast.identifier('passThrough'));
            var httpBackendPassThroughCallExpression = ast.callExpression(httpBackendPassThroughMemberExpression);
            mockASTs.push(ast.expressionStatement(httpBackendPassThroughCallExpression));
        });

        var httpBackendFlushMemberExpression = ast.memberExpression(httpBackendIdentifier, ast.identifier('flush'));
        var httpBackendFlushCallExpression = ast.callExpression(httpBackendFlushMemberExpression);
        var returnHttpBackendFlush = ast.returnStatement(httpBackendFlushCallExpression);
        mockASTs.push(returnHttpBackendFlush);

        var setupBlockExpression = ast.blockStatement(mockASTs);
        var setupFunctionExpression = ast.functionExpression(null, null, setupBlockExpression);
        var setupCallExpression = ast.callExpression(setupFunctionExpression);

        return ast.expressionStatement(setupCallExpression);
    }
};

StepDefinitionEditor.factory('HttpBackendSetupTaskModel', function (
    ASTCreatorService,
    MockModel
) {
    return createHttpBackendSetupTaskModelConstructor(ASTCreatorService, MockModel);
});
