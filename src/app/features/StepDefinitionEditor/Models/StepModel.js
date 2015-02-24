'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ExpectationModel');
require('./TaskModel');
require('./MockModel');

var createStepModelConstructor = function (
    ASTCreatorService,
    ExpectationModel,
    TaskModel,
    MockModel
) {
    var StepModel = function StepModel (stepDefinition) {
        var expectations = [];
        var tasks = [];
        var mocks = [];

        Object.defineProperties(this, {
            stepDefinition: {
                get: function () {
                    return stepDefinition;
                }
            },
            expectations: {
                get: function () {
                    return expectations;
                }
            },
            tasks: {
                get: function () {
                    return tasks;
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

    StepModel.prototype.stepTypes = ['Given', 'When', 'Then', 'And', 'But'];

    StepModel.prototype.addExpectation = function () {
        this.expectations.push(new ExpectationModel(this));
    };

    StepModel.prototype.removeExpectation = function (expectation) {
        _.remove(this.expectations, expectation);
    };

    StepModel.prototype.addTask = function () {
        this.tasks.push(new TaskModel(this));
    };

    StepModel.prototype.removeTask = function (task) {
        _.remove(this.tasks, task);
    };

    StepModel.prototype.addMock = function () {
        this.mocks.push(new MockModel(this));
    };

    StepModel.prototype.removeMock = function (mock) {
        _.remove(this.mocks, mock);
    };

    return StepModel;

    function toAST () {
        var ast = ASTCreatorService;

        var thisStep = ast.memberExpression(ast.thisExpression(), ast.identifier(this.type));
        var stepRegexLiteral = ast.literal(this.regex);
        var stepDoneIdentifier = ast.identifier('done');

        var expectationASTs = _.map(this.expectations, function (expectation) {
            return expectation.ast;
        });
        var promisesArrayExpression = ast.arrayExpression(expectationASTs);

        var mockASTs = _.map(this.mocks, function (mock) {
            return mock.ast;
        });

        var taskASTs = _.map(this.tasks, function (task) {
            return task.ast;
        });

        var doneCallExpression;
        if (this.tasks.length || this.expectations.length || this.mocks.length) {
            doneCallExpression = ast.callExpression(stepDoneIdentifier);
        } else {
            var pendingMemberExpression = ast.memberExpression(stepDoneIdentifier, ast.identifier('pending'));
            doneCallExpression = ast.callExpression(pendingMemberExpression);
        }
        var doneExpressionStatement = ast.expressionStatement(doneCallExpression);

        var blockBody = mockASTs || [];

        if (this.tasks.length) {
            var firstTask = _.first(taskASTs);
            var tasksDeclaration;
            _.each(_.rest(taskASTs), function (taskAST) {
                var thenIdentifier = ast.identifier('then');
                var promiseThenMemberExpression = ast.memberExpression(firstTask.expression, thenIdentifier);

                var taskReturnStatement = ast.returnStatement(taskAST.expression);
                var taskBlockStatement = ast.blockStatement([taskReturnStatement]);
                var taskFunctionExpression = ast.functionExpression(null, null, taskBlockStatement);

                firstTask.expression = ast.callExpression(promiseThenMemberExpression, [taskFunctionExpression]);
            }, this);

            var tasksIdentifier = ast.identifier('tasks');
            var tasksDeclarator = ast.variableDeclarator(tasksIdentifier, firstTask.expression);
            tasksDeclaration = ast.variableDeclaration([tasksDeclarator]);
            promisesArrayExpression.elements.push(tasksIdentifier);
            blockBody.push(tasksDeclaration);
        }

        if (this.tasks.length || this.expectations.length) {
            var promiseAllMemberExpression = ast.memberExpression(ast.identifier('Promise'), ast.identifier('all'));
            var promiseAllCallExpression = ast.callExpression(promiseAllMemberExpression, [promisesArrayExpression]);
            var promisesMemberExpression = ast.memberExpression(promiseAllCallExpression, ast.identifier('then'));
            var promisesDoneBlockStatement = ast.blockStatement([doneExpressionStatement]);
            var promisesDoneFunctionExpression = ast.functionExpression(null, null, promisesDoneBlockStatement);
            var promisesDoneCallExpression = ast.callExpression(promisesMemberExpression, [promisesDoneFunctionExpression]);
            var expectationsExpression = ast.expressionStatement(promisesDoneCallExpression);
            blockBody.push(expectationsExpression);
        } else {
            blockBody.push(doneExpressionStatement);
        }

        var stepBlockStatement = ast.blockStatement(blockBody);
        var stepFunctionExpression = ast.functionExpression(null, [stepDoneIdentifier], stepBlockStatement);
        var stepCallExpression = ast.callExpression(thisStep, [stepRegexLiteral, stepFunctionExpression]);
        return ast.expressionStatement(stepCallExpression);
    }
};

StepDefinitionEditor.factory('StepModel', function (
    ASTCreatorService,
    ExpectationModel,
    TaskModel,
    MockModel
) {
    return createStepModelConstructor(ASTCreatorService, ExpectationModel, TaskModel, MockModel);
});
