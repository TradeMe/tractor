'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as camelcase from 'camel-case';
import * as path from 'path';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Factory } from '../../../shared/factory/factory.interface';
import { MockData } from '../../mock-data/mock-data/mock-data';
import { StepDefinition } from '../step-definition/step-definition';

@Injectable()
export class MockDataInstanceFactory implements Factory<MockDataInstance> {
    constructor (
        private astService: ASTService
    ) { }

    public create (mockData: MockData, stepDefinition: StepDefinition): MockDataInstance {
        let instance = new MockDataInstance(this.astService);
        instance.init(mockData, stepDefinition);
        return instance;
    }
}

export class MockDataInstance {
    private _mockData: MockData;
    private _stepDefinition: StepDefinition;

    public get ast (): ESCodeGen.Statement {
        return this.toAST();
    }

    public get meta () {
        let { name } = this;
        return { name };
    }

    public get mockData (): MockData {
        return this._mockData;
    }

    public get name (): string {
        return this.mockData.name;
    }

    public get stepDefinition (): StepDefinition {
        return this._stepDefinition;
    }

    public get variableName (): string {
        return camelcase(this.name);
    }

    constructor (
        private astService: ASTService
    ) { }

    public init (mockData: MockData, stepDefinition: StepDefinition) {
        this._mockData = mockData;
        this._stepDefinition = stepDefinition;
    }

    private toAST (): ESCodeGen.Statement {
        // Sw33t hax()rz to get around the node "path" shim not working on Windows.
        let stepDefinitionPath = this.stepDefinition.path.replace(/\\/g, '/');
        let mockDataPath = this.mockData.path.replace(/\\/g, '/');
        let relativePath = this.astService.literal(path.relative(path.dirname(stepDefinitionPath), mockDataPath));
        let name = this.astService.identifier(this.variableName);

        let template = 'var <%= name %> = require(<%= relativePath %>); ';

        return this.astService.template(template, { name, relativePath });
    }
}
