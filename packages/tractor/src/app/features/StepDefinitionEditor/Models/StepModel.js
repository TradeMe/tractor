'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ExpectationModel');
require('./TaskModel');
require('./BrowserGetTaskModel');
require('./HttpBackendSetupTaskModel');

var createStepModelConstructor = function (
    ASTCreatorService,
    ExpectationModel,
    TaskModel,
    BrowserGetTaskModel,
    HttpBackendSetupTaskModel
) {
    var StepModel = function StepModel (stepDefinition) {
        var expectations = [];
        var tasks = [];

        var browserGetTask = new BrowserGetTaskModel();
        var httpBackendSetupTask = new HttpBackendSetupTaskModel(this);

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
            browserGetTask: {
                get: function () {
                    return browserGetTask;
                }
            },
            httpBackendSetupTask: {
                get: function () {
                    return httpBackendSetupTask;
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

        var taskASTs = _.map(this.tasks, function (task) {
            return task.ast;
        });

        if (this.type === 'Given') {
            taskASTs.unshift(this.httpBackendSetupTask.ast);
            taskASTs.unshift(this.browserGetTask.ast);
        }

        var firstTask = _.first(taskASTs);

        _.each(_.rest(taskASTs), function (taskAST) {
            var thenIdentifier = ast.identifier('then');
            var promiseThenMemberExpression = ast.memberExpression(firstTask.expression, thenIdentifier);

            var taskReturnStatement = ast.returnStatement(taskAST.expression);
            var taskBlockStatement = ast.blockStatement([taskReturnStatement]);
            var taskFunctionExpression = ast.functionExpression(null, null, taskBlockStatement);

            firstTask.expression = ast.callExpression(promiseThenMemberExpression, [taskFunctionExpression]);
        }, this);

        if (firstTask) {
            var tasksIdentifier = ast.identifier('tasks');
            var tasksDeclarator = ast.variableDeclarator(tasksIdentifier, firstTask.expression);
            var tasksDeclaration = ast.variableDeclaration([tasksDeclarator]);
            promisesArrayExpression.elements.push(tasksIdentifier);
        }

        var promiseAllMemberExpression = ast.memberExpression(ast.identifier('Promise'), ast.identifier('all'));
        var promiseAllCallExpression = ast.callExpression(promiseAllMemberExpression, [promisesArrayExpression]);
        var promisesMemberExpression = ast.memberExpression(promiseAllCallExpression, ast.identifier('then'));

        var doneCallExpression;
        if (this.tasks.length || this.expectations.length || this.type === 'Given') {
            doneCallExpression = ast.callExpression(stepDoneIdentifier);
        } else {
            var pendingMemberExpression = ast.memberExpression(stepDoneIdentifier, ast.identifier('pending'));
            doneCallExpression = ast.callExpression(pendingMemberExpression);
        }

        var doneExpressionStatement = ast.expressionStatement(doneCallExpression);
        var doneBlockStatement = ast.blockStatement([doneExpressionStatement]);
        var doneFunctionExpression = ast.functionExpression(null, null, doneBlockStatement);
        var doneCallExpression = ast.callExpression(promisesMemberExpression, [doneFunctionExpression]);
        var expectationsExpression = ast.expressionStatement(doneCallExpression);

        var blockBody = [];
        if (tasksDeclaration) {
            blockBody.push(tasksDeclaration);
        }
        if (expectationsExpression) {
            blockBody.push(expectationsExpression);
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
    BrowserGetTaskModel,
    HttpBackendSetupTaskModel
) {
    return createStepModelConstructor(ASTCreatorService, ExpectationModel, TaskModel, BrowserGetTaskModel, HttpBackendSetupTaskModel);
});
