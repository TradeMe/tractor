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
    var MockModel = function TaskModel (task) {
        Object.defineProperties(this, {
            task: {
                get: function () {
                    return task;
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
        this.data = _.first(this.task.step.stepDefinition.mockDataInstances);
    };

    MockModel.prototype.actions = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];

    return MockModel;

    function toAST () {
        var ast = ASTCreatorService;

        var httpBackendWhenMemberExpression = ast.memberExpression(ast.identifier('httpBackend'), ast.identifier('when'));
        var httpBackendWhenCallExpression = ast.callExpression(httpBackendWhenMemberExpression, [ast.literal(this.action), ast.literal(this.url)]);
        var httpBackendRespondMemberExpression = ast.memberExpression(httpBackendWhenCallExpression, ast.identifier('respond'));
        var httpBackendRespondCallExpression = ast.callExpression(httpBackendRespondMemberExpression, [ast.identifier(this.data.name)]);

        return ast.expressionStatement(httpBackendRespondCallExpression);
    }
};

StepDefinitionEditor.factory('MockModel', function (
    ASTCreatorService
) {
    return createMockModelConstructor(ASTCreatorService);
});
