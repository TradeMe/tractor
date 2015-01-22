'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ExpectationModel');
require('./TaskModel');

var createStepModelConstructor = function (
    ASTCreatorService,
    ExpectationModel,
    TaskModel
) {
    var ast = ASTCreatorService;

    var StepModel = function StepModel (stepDefinition) {
        var tasks = [];
        var expectations = [];

        Object.defineProperties(this, {
            stepDefinition: {
                get: function () {
                    return stepDefinition;
                }
            },
            tasks: {
                get: function () {
                    return tasks;
                }
            },
            expectations: {
                get: function () {
                    return expectations;
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

    StepModel.prototype.addTask = function () {
        this.tasks.push(new TaskModel(this));
    };

    StepModel.prototype.removeTask = function (task) {
        _.remove(this.tasks, task);
    };

    StepModel.prototype.addExpectation = function () {
        this.expectations.push(new ExpectationModel(this));
    };

    StepModel.prototype.removeExpectation = function (expectation) {
        _.remove(this.expectations, expectation);
    };

    return StepModel;

    function toAST () {
        var thisStep = ast.createMemberExpression(ast.createThisExpression(), ast.createIdentifier(this.type));
        var stepRegexLiteral = ast.createLiteral(this.regex);
        var stepDoneIdentifier = ast.createIdentifier('done');

        var expectationASTs = _.map(this.expectations, function (expectation) {
            return expectation.ast;
        });
        var promisesArrayExpression = ast.createArrayExpression(expectationASTs);

        var taskASTs = _.map(this.tasks, function (task) {
            return task.ast;
        });
        var firstTask = _.first(taskASTs);

        _.each(_.rest(taskASTs), function (taskAST) {
            var thenIdentifier = ast.createIdentifier('then');
            var promiseThenMemberExpression = ast.createMemberExpression(firstTask.expression, thenIdentifier);

            var taskReturnStatement = ast.createReturnStatement(taskAST.expression);
            var taskBlockStatement = ast.createBlockStatement([taskReturnStatement]);
            var taskFunctionExpression = ast.createFunctionExpression(null, null, taskBlockStatement);

            firstTask.expression = ast.createCallExpression(promiseThenMemberExpression, [taskFunctionExpression]);
        }, this);

        if (firstTask) {
            var tasksIdentifier = ast.createIdentifier('tasks');
            var tasksDeclarator = ast.createVariableDeclarator(tasksIdentifier, firstTask.expression);
            var tasksDeclaration = ast.createVariableDeclaration([tasksDeclarator]);
            promisesArrayExpression.elements.push(tasksIdentifier);
        }

        var promiseAllMemberExpression = ast.createMemberExpression(ast.createIdentifier('Promise'), ast.createIdentifier('all'));
        var promiseAllCallExpression = ast.createCallExpression(promiseAllMemberExpression, [promisesArrayExpression]);
        var promisesMemberExpression = ast.createMemberExpression(promiseAllCallExpression, ast.createIdentifier('then'));

        var doneCallExpression;
        if (this.tasks.length || this.expectations.length) {
            doneCallExpression = ast.createCallExpression(stepDoneIdentifier);
        } else {
            var pendingMemberExpression = ast.createMemberExpression(stepDoneIdentifier, ast.createIdentifier('pending'));
            doneCallExpression = ast.createCallExpression(pendingMemberExpression);
        }

        var doneExpressionStatement = ast.createExpressionStatement(doneCallExpression);
        var doneBlockStatement = ast.createBlockStatement([doneExpressionStatement]);
        var doneFunctionExpression = ast.createFunctionExpression(null, null, doneBlockStatement);
        var doneCallExpression = ast.createCallExpression(promisesMemberExpression, [doneFunctionExpression]);
        var expectationsExpression = ast.createExpressionStatement(doneCallExpression);

        var blockBody = [];
        if (tasksDeclaration) {
            blockBody.push(tasksDeclaration);
        }
        if (expectationsExpression) {
            blockBody.push(expectationsExpression);
        }

        var stepBlockStatement = ast.createBlockStatement(blockBody);
        var stepFunctionExpression = ast.createFunctionExpression(null, [stepDoneIdentifier], stepBlockStatement);
        var stepCallExpression = ast.createCallExpression(thisStep, [stepRegexLiteral, stepFunctionExpression]);
        return ast.createExpressionStatement(stepCallExpression);
    }
};

StepDefinitionEditor.factory('StepModel', function (
    ASTCreatorService,
    ExpectationModel,
    TaskModel
) {
    return createStepModelConstructor(ASTCreatorService, ExpectationModel, TaskModel);
});
