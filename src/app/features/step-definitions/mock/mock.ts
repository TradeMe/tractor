'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Factory } from '../../../shared/factory/factory.interface';
import { MockDataInstance } from '../mock-data-instance/mock-data-instance';
import { Step } from '../step/step';

// Constants:
const ACTIONS = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];

@Injectable()
export class MockFactory implements Factory<Mock> {
    constructor (
        private astService: ASTService
    ) {}

    create (step: Step): Mock {
        let instance = new Mock(this.astService);
        instance.init(step);
        return instance;
    }
}

export class Mock {
    public action: string;
    public actions = ACTIONS;
    public passThrough: boolean = false;
    public mockData: MockDataInstance
    public url: string = '';

    private _step: Step;

    public get ast (): ESCodeGen.Statement {
        return this.toAST();
    }

    public get step (): Step {
        return this._step;
    }

    constructor (
        private astService: ASTService
    ) { }

    public init (step: Step) {
        this._step = step;

        let [action] = this.actions;
        this.action = action;

        let [mockDataInstance] = this.step.stepDefinition.mockDataInstances;
        this.mockData = mockDataInstance;
    }

    private toAST (): ESCodeGen.Statement {
        let dataName = null;
        let url = this.astService.literal(new RegExp(this.url));

        let template = `httpBackend.when${this.action}(%= url %)`;
        if (this.passThrough) {
            template += '.passThrough(); ';
        } else {
            template += '.respond(%= dataName %); ';
            dataName = this.astService.identifier(this.mockData.variableName);
        }

        return this.astService.template(template, { dataName, url });
    }
}
