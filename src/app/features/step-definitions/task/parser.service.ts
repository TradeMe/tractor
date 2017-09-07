'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as assert from 'assert';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Parser } from '../../../shared/parser/parser.interface';
import { Step } from '../step/step';
import { Task, TaskFactory } from '../task/task';

@Injectable()
export class TaskParserService implements Parser<Task> {
    constructor (
        private astService: ASTService,
        private taskFactory: TaskFactory
    ) { }

    public parse (step: Step, ast): Task {
        try {
            this.parseNextTask(step, ast);

            let parsers = [this.parseFirstTask, this.parseSubsequentTask];
            let taskCallExpression = this.parseTaskCallExpression(ast, parsers);

            try {
                return this.parseTask(step, taskCallExpression);
            } catch (e) {}

            throw new Error();
        } catch (e) {
            console.warn('Invalid task:', this.astService.toJS(ast));
            return null;
        }
    }

    private parseNextTask (step: Step, ast): void {
        try {
            assert(ast.callee.object.callee);
            this.parse(step, ast.callee.object);
        } catch (e) {}
    }

    private parseTaskCallExpression (ast, parsers) {
        let taskCallExpression = null;
        parsers.filter(parser => {
            try {
                taskCallExpression = parser.call(this, ast);
            } catch (e) { }
        });
        if (!taskCallExpression) {
            throw new Error();
        }
        return taskCallExpression;
    }

    private parseFirstTask (ast) {
        assert(ast.callee.object.name && ast.callee.property.name);
        return ast;
    }

    private parseSubsequentTask (ast) {
        let [thenFunctionExpression] = ast.arguments;
        let [taskReturnStatement] = thenFunctionExpression.body.body;
        let { argument } = taskReturnStatement;
        assert(argument.callee.object.name && argument.callee.property.name);
        return argument;
    }

    private parseTask (step: Step, taskCallExpression): Task {
        let task = this.taskFactory.create(step);
        task.pageObject = task.step.stepDefinition.pageObjectInstances.find(pageObjectInstance => {
            return taskCallExpression.callee.object.name === pageObjectInstance.variableName;
        });
        assert(task.pageObject);
        task.action = task.pageObject.pageObject.actions.find(action => {
            return taskCallExpression.callee.property.name === action.variableName;
        });
        assert(task.action);
        taskCallExpression.arguments.forEach((argument, index) => {
            task.arguments[index].value = argument.value;
        });
        task.step.tasks.push(task);
        return task;
    }
}
