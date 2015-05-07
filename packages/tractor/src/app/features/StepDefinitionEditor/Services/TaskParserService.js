'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../Models/TaskModel');

var TaskParserService = function TaskParserService (
    TaskModel
) {
    return {
        parse: parse
    };

    function parse (step, ast) {
        try {
            parseNextTask(step, ast);

            var parsers = [parseFirstTask, parseSubsequentTask];
            var taskCallExpression = parseTaskCallExpression(ast, parsers);

            try {
                return parseTask(step, taskCallExpression);
            } catch (e) { }

            throw new Error();
        } catch (e) {
            console.warn('Invalid task:', ast);
            return null;
        }
    }

    function parseNextTask (step, ast) {
        try {
            assert(ast.callee.object.callee);
            parse(step, ast.callee.object);
        } catch (e) { }
    }

    function parseTaskCallExpression (ast, parsers) {
        var taskCallExpression = null;
        parsers.filter(function (parser) {
            try {
                taskCallExpression = parser(ast);
            } catch (e) { }
        });
        if (!taskCallExpression) {
            throw new Error();
        }
        return taskCallExpression;
    }

    function parseFirstTask (ast) {
        assert(ast.callee.object.name && ast.callee.property.name);
        return ast;
    }

    function parseSubsequentTask (ast) {
        var thenFunctionExpression = _.first(ast.arguments);
        var taskReturnStatement = _.first(thenFunctionExpression.body.body);
        return taskReturnStatement.argument;
    }

    function parseTask (step, taskCallExpression) {
        var task = new TaskModel(step);
        task.component = _.find(task.step.stepDefinition.componentInstances, function (componentInstance) {
            return taskCallExpression.callee.object.name === componentInstance.variableName;
        });
        task.action = _.find(task.component.component.actions, function (action) {
            return taskCallExpression.callee.property.name === action.variableName;
        });
        _.each(taskCallExpression.arguments, function (argument, index) {
            task.arguments[index].value = argument.value;
        });
        task.step.tasks.push(task);
        return true;
    }
};

StepDefinitionEditor.service('TaskParserService', TaskParserService);
