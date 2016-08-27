'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Factory } from '../../../shared/factory/factory.interface';
import { FileStructureItem } from '../../../shared/file-structure/file-structure-item.interface';
import { MockData } from '../../mock-data/mock-data/mock-data';
import { MockDataInstance, MockDataInstanceFactory } from '../mock-data-instance/mock-data-instance';
import { PageObject } from '../../page-objects/page-object/page-object';
import { PageObjectInstance, PageObjectInstanceFactory } from '../page-object-instance/page-object-instance';
import { Step } from '../step/step';

@Injectable()
export class StepDefinitionFactory implements Factory<StepDefinition> {
    constructor (
        private astService: ASTService,
        private mockDataInstanceFactory: MockDataInstanceFactory,
        private pageObjectInstanceFactory: PageObjectInstanceFactory
    ) { }

    public create (options): StepDefinition {
        let instance = new StepDefinition(this.astService, this.mockDataInstanceFactory, this.pageObjectInstanceFactory);
        instance.init(options);
        return instance;
    }
}

export class StepDefinition implements FileStructureItem {
    private _mockData: Array<MockData> = [];
    private _mockDataInstances: Array<MockDataInstance> = [];
    private _options;
    private _pageObjects: Array<PageObject> = [];
    private _pageObjectInstances: Array<PageObjectInstance> = [];

    public name: string;
    public step: Step;

    public get ast (): ESCodeGen.Program {
        return this.toAST();
    }

    public get availablePageObjects (): Array<PageObject> {
        return this._options.availablePageObjects || [];
    }

    public get availableMockData (): Array<MockData> {
        return this._options.avaiableMockData || [];
    }

    public get data (): ESCodeGen.Program {
        return this.ast;
    }

    public get meta (): string {
        return JSON.stringify({
            name: this.name,
            pageObjects: this.pageObjectInstances.map(pageObject => pageObject.meta),
            mockData: this.mockDataInstances.map(mockData => mockData.meta)
        });
    }

    public get mockData (): Array<MockData> {
        return this._mockData;
    }

    public get mockDataInstances (): Array<MockDataInstance> {
        return this._mockDataInstances;
    }

    public get pageObjects (): Array<PageObject> {
        return this._pageObjects;
    }

    public get pageObjectInstances (): Array<PageObjectInstance> {
        return this._pageObjectInstances;
    }

    public get path (): string {
        return this._options.path;
    }

    constructor (
        private astService: ASTService,
        private mockDataInstanceFactory: MockDataInstanceFactory,
        private pageObjectInstanceFactory: PageObjectInstanceFactory
    ) { }

    public init (options = {}): void {
        this._options = options;
    }

    public addPageObject (name: string): void {
        let pageObject = this.availablePageObjects.find(availablePageObject => availablePageObject.name === name);
        if (pageObject && !this.pageObjects.includes(pageObject)) {
            this.pageObjects.push(pageObject);
            this.pageObjectInstances.push(this.pageObjectInstanceFactory.create(pageObject, this));
        }
    }

    public removePageObject(toRemove: PageObjectInstance) {
        let index = this.pageObjectInstances.indexOf(toRemove);
        this.pageObjectInstances.splice(index, 1);
        this.pageObjects.splice(index, 1);
    }

    public addMock (name: string): void {
        let mockData = this.availableMockData.find(availableMockData => availableMockData.name === name);
        if (mockData && !this.mockData.includes(mockData)) {
            this.mockData.push(mockData);
            this.mockDataInstances.push(this.mockDataInstanceFactory.create(mockData, this));
        }
    }

    public removeMock (toRemove: MockDataInstance) {
        let index = this.mockDataInstances.indexOf(toRemove);
        this.mockDataInstances.splice(index, 1);
        this.mockData.splice(index, 1);
    }

    private toAST (): ESCodeGen.Program {
        let pageObjects = this.pageObjectInstances.map(pageObjectInstance => pageObjectInstance.ast);
        let mockData = this.mockDataInstances.map(mockDataInstance => mockDataInstance.ast);

        let template = 'module.exports = function () { ';
        if (pageObjects.length) {
            template += '%= pageObjects %; ';
        }
        if (mockData.length) {
            template += '%= mockData %; ';
        }
        template += '%= step %; ';
        template += '};';

        let step = this.step.ast;
        return this.astService.file(this.astService.expression(template, { pageObjects, mockData, step }), this.meta);
    }
}
