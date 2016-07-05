'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as camelcase from 'camel-case';

// Dependencies:
import { Action } from '../action/action';
import { ASTService } from '../../shared/ast/ast.service';
import { Factory } from '../../shared/factory/factory.interface';

@Injectable()
export class ParameterFactory implements Factory<Parameter> {
    constructor (
        private astService: ASTService
    ) {}

    create (action: Action): Parameter {
        let instance = new Parameter(action);
        instance.setServices(this.astService);
        return instance;
    }
}

export class Parameter {
    private _action: Action;

    private astService: ASTService;

    public name: string = '';

    public get action (): Action {
        return this._action;
    }

    public get variableName (): string {
        return camelcase(this.name);
    }

    public get meta () {
        return {
            name: this.name
        };
    }

    public get ast (): ESCodeGen.Identifier {
        return this.toAST();
    }

    constructor (action: Action) {
        this._action = action;
    }

    public setServices (astService: ASTService): void {
        this.astService = astService;
    }

    public getAllVariableNames (): Array<string> {
        let currentParameter = this;
        return this.action.parameters
        .filter((parameter) => parameter !== currentParameter)
        .map((object) => object.name);
    }

    private toAST (): ESCodeGen.Identifier {
        return this.astService.identifier(this.variableName);
    }
}

export const PARAMETER_PROVIDERS = [
    ParameterFactory,
    ASTService
];
