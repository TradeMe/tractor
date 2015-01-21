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

    function parse (step, astObject) {
        var task = new TaskModel(step);

        var notFirstTask = false;
        var notTask = false;
        var notValidTask = false;

        try {
            assert(astObject.callee.object.callee);
            parse(step, astObject.callee.object);
        } catch (e) { }

        var taskCallExpression;

        try {
            assert(astObject.callee.object.name && astObject.callee.property.name)
            taskCallExpression = astObject;
        } catch (e) { notFirstTask = true; }

        try {
            if (notFirstTask) {
                var thenFunctionExpression = _.first(astObject.arguments);
                var taskReturnStatement = _.first(thenFunctionExpression.body.body);
                taskCallExpression = taskReturnStatement.argument;
            }
        } catch (e) { notTask = true; }

        try {
            task.component = _.find(task.step.stepDefinition.componentInstances, function (componentInstance) {
                return taskCallExpression.callee.object.name === componentInstance.name;
            });
            task.action = _.find(task.component.component.actions, function (action) {
                return taskCallExpression.callee.property.name === action.name;
            });
            _.each(taskCallExpression.arguments, function (argument, index) {
                task.arguments[index].value = argument.value;
            });
            step.tasks.push(task);
        } catch (e) { notValidTask = true; }

        if (notFirstTask && notTask && notValidTask) {
            console.log(astObject);
        }
    }
};

StepDefinitionEditor.service('TaskParserService', TaskParserService);
