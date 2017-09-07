'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Action } from '../../page-objects/action/action';
import { ASTService } from '../../../shared/ast/ast.service';
import { Expectation, ExpectationFactory } from '../expectation/expectation';
import { PageObjectInstance } from '../page-object-instance/page-object-instance';
import { Parser } from '../../../shared/parser/parser.interface';
import { Step } from '../step/step';

@Injectable()
export class ExpectationParserService implements Parser<Expectation> {
    constructor (
        private astService: ASTService,
        private expectationFactory: ExpectationFactory
    ) { }

    public parse (step: Step, ast): Expectation {
        try {
            let expectation = this.expectationFactory.create(step);
            let [firstArgument] = ast.arguments;
            expectation.value = firstArgument.value;

            let [expectationCallExpression] = ast.callee.object.object.object.arguments;

            expectation.pageObject = this.parsePageObject(expectation, expectationCallExpression);
            expectation.action = this.parseAction(expectation, expectationCallExpression);
            expectation.condition = ast.callee.property.name;
            this.parseArguments(expectation, expectationCallExpression);

            return expectation;
        } catch (e) {
            console.warn('Invalid expectation:', this.astService.toJS(ast));
            return null;
        }
    }

    private parseAction (expectation: Expectation, expectationCallExpression): Action {
        return expectation.pageObject.pageObject.actions.find(action => {
            return expectationCallExpression.callee.property.name === action.variableName;
        });
    }

    private parseArguments (expectation: Expectation, expectationCallExpression): void {
        expectationCallExpression.arguments.forEach((argument, index) => {
            expectation.arguments[index].value = argument.value;
        });
    }

    private parsePageObject (expectation: Expectation, expectationCallExpression): PageObjectInstance {
        return expectation.step.stepDefinition.pageObjectInstances.find(componentInstance => {
            return expectationCallExpression.callee.object.name === componentInstance.variableName;
        });
    }
}
