'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { ExpectationParserService } from '../expectation/parser.service';
import { MockParserService } from '../mock/parser.service';
import { Parser } from '../../../shared/parser/parser.interface';
import { Step, StepFactory } from '../step/step';
import { StepDefinition } from '../step-definition/step-definition';
import { TaskParserService } from '../task/parser.service';

@Injectable()
export class StepParserService implements Parser<Step> {
    constructor (
        private astService: ASTService,
        private expectationParserService: ExpectationParserService,
        private mockParserService: MockParserService,
        private stepFactory: StepFactory,
        private taskParserService: TaskParserService
    ) { }

    public parse (stepDefinition: StepDefinition, ast): Step {
        try {
            let step = this.stepFactory.create(stepDefinition);

            let stepCallExpression = ast.expression;
            step.type = this.parseType(step, stepCallExpression);
            step.regex = this.parseRegex(step, stepCallExpression);

            let [stepFunction] = ast.expression.arguments.slice().reverse();
            let statements = stepFunction.body.body;
            let parsers = [this.parseMock, this.parseTask, this.parseExpectation, this.parsePending, this.parseMockDone, this.parseTaskDone];
            this.tryParse(step, statements, parsers);

            return step;
        } catch (e) {
            console.warn('Invalid step:', this.astService.toJS(ast));
            return null;
        }
    }

    private parseType (step: Step, stepCallExpression): string {
        let type = stepCallExpression.callee.property.name;
        assert(step.stepTypes.includes(type));
        return type;
    }

    private parseRegex (step: Step, stepCallExpression): RegExp {
        let [stepRegexArgument] = stepCallExpression.arguments;
        let regex = stepRegexArgument.raw.replace(/^\//, '').replace(/\/$/, '');
        assert(regex);
        return new RegExp(regex);
    }

    private tryParse (step: Step, statements, parsers): void {
        statements.map(statement => {
            let parsed = parsers.some(parser => {
                try {
                    return parser.call(this, step, statement);
                } catch (e) {}
            });
            if (!parsed) {
                throw new Error();
            }
        });
    }

    private parseMock (step: Step, statement): boolean {
        let httpBackendOnloadMemberExpression = statement.expression.callee.object.callee;
        assert(httpBackendOnloadMemberExpression.object.name === 'httpBackend');
        assert(httpBackendOnloadMemberExpression.property.name.indexOf('when') === 0);
        let mock = this.mockParserService.parse(step, statement);
        assert(mock);
        step.mocks.push(mock);
        return true;
    }

    private parseTask (step: Step, statement): boolean {
        let [tasksDeclaration] = statement.declarations;
        assert(tasksDeclaration.id.name === 'tasks');
        this.taskParserService.parse(step, tasksDeclaration.init);
        return true;
    }

    private parseExpectation (step: Step, statement): boolean {
        let [argument] = statement.expression.callee.object.callee.object.arguments;
        argument.elements.forEach(element => {
            assert(!(element.name && element.name === 'tasks'));
            let expectation = this.expectationParserService.parse(step, element);
            assert(expectation);
            step.expectations.push(expectation);
        });
        return true;
    }

    private parsePending (step: Step, statement): boolean {
        let callee = statement.expression.callee;
        assert(callee.object.name === 'callback' || callee.object.name === 'done');
        assert(callee.property.name === 'pending');
        return true;
    }

    private parseMockDone (step: Step, statement): boolean {
        assert(statement.expression.callee.name === 'done');
        return true;
    }

    private parseTaskDone (step: Step, statement): boolean {
        let [argument] = statement.expression.callee.object.arguments;
        assert(argument.name === 'done');
        return true;
    }
}
