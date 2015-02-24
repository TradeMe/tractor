'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var createMockModelConstructor = function (
    ASTCreatorService
) {
    var MockModel = function TaskModel (step) {
        Object.defineProperties(this, {
            step: {
                get: function () {
                    return step;
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.url = '';
        this.action = _.first(this.actions);
        this.data = _.first(this.step.stepDefinition.mockDataInstances);
        this.passThrough = false;
    };

    MockModel.prototype.actions = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];

    return MockModel;

    function toAST () {
        var ast = ASTCreatorService;

        var httpBackendOnLoadMemberExpression = ast.memberExpression(ast.identifier('httpBackend'), ast.identifier('onLoad'));
        var httpBackendWhenMemberExpression = ast.memberExpression(httpBackendOnLoadMemberExpression, ast.identifier('when'));
        var httpBackendWhenCallExpression = ast.callExpression(httpBackendWhenMemberExpression, [ast.literal(this.action), ast.literal(this.url)]);

        var httpBackendCallExpression;
        if (this.passThrough) {
            var httpBackendRespondMemberExpression = ast.memberExpression(httpBackendWhenCallExpression, ast.identifier('passThrough'));
            httpBackendCallExpression = ast.callExpression(httpBackendRespondMemberExpression);
        } else {
            var httpBackendRespondMemberExpression = ast.memberExpression(httpBackendWhenCallExpression, ast.identifier('respond'));
            httpBackendCallExpression = ast.callExpression(httpBackendRespondMemberExpression, [ast.identifier(this.data.name)]);
        }

        return ast.expressionStatement(httpBackendCallExpression);
    }
};

StepDefinitionEditor.factory('MockModel', function (
    ASTCreatorService
) {
    return createMockModelConstructor(ASTCreatorService);
});
