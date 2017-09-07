'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Action } from '../../page-objects/action/action'
import { Argument, ArgumentFactory } from '../../page-objects/argument/argument';
import { ASTService } from '../../../shared/ast/ast.service';
import { Factory } from '../../../shared/factory/factory.interface';
import { PageObjectInstance } from '../page-object-instance/page-object-instance';
import { Step } from '../step/step';

@Injectable()
export class TaskFactory implements Factory<Task> {
    constructor (
        private argumentFactory: ArgumentFactory,
        private astService: ASTService
    ) { }

    create (step: Step): Task {
        let instance = new Task(this.argumentFactory, this.astService);
        instance.init(step);
        return instance;
    }
}

export class Task {
    private _action: Action;
    private _args: Array<Argument>;
    private _pageObject: PageObjectInstance;
    private _step: Step;

    public get action (): Action {
        return this._action;
    }
    public set action (newAction: Action) {
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
        let [firstAction] = this.pageObject.pageObject.actions;
        this.action = firstAction;
    }

    public get step (): Step {
        return this._step;
    }

    constructor (
        private argumentFactory: ArgumentFactory,
        private astService: ASTService
    ) { }

    public init (step: Step): void {
        this._step = step;

        let [firstPageObject] = this.step.stepDefinition.pageObjectInstances;
        this.pageObject = firstPageObject;
    }

    private parseArguments (): Array<Argument> {
        return this.action.parameters.map(parameter => {
            let name = parameter.name;
            name = name.replace(/([A-Z])/g, ' $1');
            name = `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`;
            return this.argumentFactory.create(null, { name });
        });
    }

    private toAST (): ESCodeGen.Expression {
        let template = '<%= component %>.<%= action %>(%= taskArguments %)';

        let action = this.astService.identifier(this.action.variableName);
        let pageObject = this.astService.identifier(this.pageObject.variableName);
        let taskArguments = this.arguments.map(argument => argument.ast);

        return (<any>this.astService.template(template, { action, pageObject, taskArguments })).expression;
    }
}
