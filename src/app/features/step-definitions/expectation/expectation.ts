'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Action } from '../../page-objects/action/action';
import { Argument, ArgumentFactory } from '../../page-objects/argument/argument';
import { ASTService } from '../../../shared/ast/ast.service';
import { Factory } from '../../../shared/factory/factory.interface';
import { PageObjectInstance } from '../page-object-instance/page-object-instance';
import { Step } from '../step/step';
import { StringToLiteralService } from '../../../shared/string-to-literal/string-to-literal.service';

// Constants:
const CONDITIONS = ['equal', 'contain'];

@Injectable()
export class ExpectationFactory implements Factory<Expectation> {
    constructor (
        private argumentFactory: ArgumentFactory,
        private astService: ASTService,
        private stringToLiteralService: StringToLiteralService
    ) { }

    public create (step: Step): Expectation {
        let instance = new Expectation(this.argumentFactory, this.astService, this.stringToLiteralService);
        instance.init(step);
        return instance;
    }
}

export class Expectation {
    public condition: string;
    public conditions = CONDITIONS;
    public value: string = '';

    private _action: Action;
    private _args: Array<Argument>;
    private _pageObject: PageObjectInstance;
    private _step: Step;

    public get action (): Action {
        return this._action;
    }
    public set action (newAction) {
        this._action = newAction;
        this._args = this.parseArguments();
    }

    public get arguments (): Array<Argument> {
        return this._args;
    }

    public get ast (): ESCodeGen.Expression {
        return this.toAST();
    }

    public get pageObject (): PageObjectInstance {
        return this._pageObject;
    }
    public set pageObject (newPageObject: PageObjectInstance) {
        this._pageObject = newPageObject;
        let [action] = this.pageObject.pageObject.actions;
        this.action = action;
    }

    public get step (): Step {
        return this._step;
    }

    constructor (
        private argumentFactory: ArgumentFactory,
        private astService: ASTService,
        private stringToLiteralService: StringToLiteralService
    ) { }

    public init (step: Step): void {
        this._step = step;

        let [pageObjectInstance] = this.step.stepDefinition.pageObjectInstances;
        this.pageObject = pageObjectInstance;

        let [condition] = this.conditions;
        this.condition = condition;
    }

    private parseArguments (): Array<Argument> {
        return this.action.parameters.map(parameter => {
            return this.argumentFactory.create(null, {
                name: parameter.name
            });
        });
    }

    private toAST (): ESCodeGen.Expression {
        let expectationArguments = this.arguments.map(argument => argument.ast);
        let expectedResult = this.astService.literal(this.stringToLiteralService.toLiteral(this.value));

        let action = this.astService.identifier(this.action.variableName);
        let pageObject = this.astService.identifier(this.pageObject.variableName);
        let condition = this.astService.identifier(this.condition);

        let template = 'expect(<%= pageObject %>.<%= action %>(%= expectationArguments %)).to.eventually.<%= condition %>(<%= expectedResult %>); ';

        return (<any>this.astService.template(template, { action, pageObject, condition, expectationArguments, expectedResult })).expression;
    }
}
