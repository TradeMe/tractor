'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Expectation, ExpectationFactory } from '../expectation/expectation';
import { Factory } from '../../../shared/factory/factory.interface';
import { Mock, MockFactory } from '../mock/mock';
import { StepDefinition } from '../step-definition/step-definition';
import { Task, TaskFactory } from '../task/task';

// Constants:
const STEP_TYPES = ['Given', 'When', 'Then', 'And', 'But'];

@Injectable()
export class StepFactory implements Factory<Step> {
    constructor (
        private astService: ASTService,
        private expectationFactory: ExpectationFactory,
        private mockFactory: MockFactory,
        private taskFactory: TaskFactory
    ) { }

    public create (stepDefinition: StepDefinition): Step {
        let instance = new Step(this.astService, this.expectationFactory, this.mockFactory, this.taskFactory);
        instance.init(stepDefinition);
        return instance;
    }
}

export class Step {
    public stepTypes = STEP_TYPES;
    public type: string;
    public regex: RegExp;

    private _expectations: Array<Expectation> = [];
    private _mocks: Array<Mock> = [];
    private _stepDefinition: StepDefinition;
    private _tasks: Array<Task> = [];

    public get ast (): ESCodeGen.Statement {
        return this.toAST();
    }

    public get expectations (): Array<Expectation> {
        return this._expectations;
    }

    public get mocks (): Array<Mock> {
        return this._mocks;
    }

    public get stepDefinition (): StepDefinition {
        return this._stepDefinition;
    }

    public get tasks (): Array<Task> {
        return this._tasks;
    }

    constructor (
        private astService: ASTService,
        private expectationFactory: ExpectationFactory,
        private mockFactory: MockFactory,
        private taskFactory: TaskFactory
    ) { }

    public addExpectation (): void {
        this.expectations.push(this.expectationFactory.create(this));
    }

    public addMock (): void {
        this.mocks.push(this.mockFactory.create(this));
    }

    public addTask (): void {
        this.tasks.push(this.taskFactory.create(this));
    }

    public init (stepDefinition: StepDefinition): void {
        this._stepDefinition = stepDefinition;
    }

    public removeExpectation (toRemove: Expectation): void {
        this.expectations.splice(this.expectations.findIndex(expectation => {
            return expectation === toRemove;
        }), 1);
    }

    public removeMock (toRemove: Mock): void {
        this.mocks.splice(this.mocks.findIndex(mock => {
            return mock === toRemove;
        }), 1);
    }

    public removeTask (toRemove: Task): void {
        this.tasks.splice(this.tasks.findIndex(task => {
            return task === toRemove;
        }), 1);
    }

    private toAST (): ESCodeGen.Statement {
        let expectations = this.expectations.map(expectation => expectation.ast);
        let mocks = this.mocks.map(mock => mock.ast);
        let tasks = this.tasks.map(task => task.ast);

        let template = 'this.<%= type %>(<%= regex %>, function (done) { ';
        if (mocks.length) {
            template += '%= mocks %; ';
            template += 'done();';
        } else if (tasks.length) {
            template += 'var tasks = <%= tasks[0] %>';
            tasks.slice(1).forEach((taskAST, index) => {
                template += `.then(function () { return <%= tasks[${index + 1}] %>; })`;
            });
            template += ';';
            template += 'Promise.resolve(tasks).then(done).catch(done.fail);';
        } else if (expectations.length) {
            template += 'Promise.all([%= expectations %]).spread(function () { done(); }).catch(done.fail);';
        } else {
            template += 'done.pending();';
        }
        template += '});';

        let type = this.astService.identifier(this.type);
        let regex = this.astService.literal(this.regex);
        return this.astService.template(template, { type, regex, mocks, tasks, expectations });
    }
}
