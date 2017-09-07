'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as camelcase from 'camel-case';
import * as path from 'path';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Factory } from '../../../shared/factory/factory.interface';
import { PageObject } from '../../page-objects/page-object/page-object';
import { StepDefinition } from '../step-definition/step-definition';

@Injectable()
export class PageObjectInstanceFactory implements Factory<PageObjectInstance> {
    constructor (
        private astService: ASTService
    ) { }

    public create (pageObject: PageObject, stepDefinition: StepDefinition): PageObjectInstance {
        let instance = new PageObjectInstance(this.astService);
        instance.init(pageObject, stepDefinition);
        return instance;
    }
}

export class PageObjectInstance {
    private _pageObject: PageObject;
    private _stepDefinition: StepDefinition;

    public get ast (): ESCodeGen.Statement {
        return this.toAST();
    }

    public get meta () {
        let { name } = this;
        return { name };
    }

    public get name (): string {
        return this.pageObject.name;
    }

    public get pageObject (): PageObject {
        return this._pageObject;
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

    public init (pageObject: PageObject, stepDefinition: StepDefinition) {
        this._pageObject = pageObject;
        this._stepDefinition = stepDefinition;
    }

    private toAST (): ESCodeGen.Statement {
        let template = 'var <%= constructor %> = require(<%= relativePath %>), ';
        template += '<%= name %> = new <%= constructor %>(); ';

        // Sw33t hax()rz to get around the node "path" shim not working on Windows.
        let stepDefinitionPath = this.stepDefinition.path.replace(/^[A-Z]:\\/, '').replace(/\\/g, '/');
        let pageObjectPath = this.pageObject.path.replace(/^[A-Z]:\\/, '').replace(/\\/g, '/');
        let relativePath = this.astService.literal(path.relative(path.dirname(stepDefinitionPath), pageObjectPath));

        let constructor = this.astService.identifier(this.pageObject.variableName);
        let name = this.astService.identifier(this.variableName);

        return this.astService.template(template, { constructor, relativePath, name });
    }
}
