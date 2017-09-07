'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as camelcase from 'camel-case';

// Dependencies:
import { Action } from '../action/action';
import { ASTService } from '../../../shared/ast/ast.service';
import { Factory } from '../../../shared/factory/factory.interface';

@Injectable()
export class ParameterFactory implements Factory<Parameter> {
    constructor (
        private astService: ASTService
    ) {}

    create (action: Action): Parameter {
        let instance = new Parameter(this.astService)
        instance.init(action);
        return instance;
    }
}

export class Parameter {
    private _action: Action;

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

    constructor (
        private astService: ASTService
    ) { }

    public init (action: Action) {
        this._action = action;
    }

    public getAllVariableNames (): Array<string> {
        let currentParameter = this;
        return this.action.parameters
        .filter(parameter => parameter !== currentParameter)
        .map(object => object.name);
    }

    private toAST (): ESCodeGen.Identifier {
        return this.astService.identifier(this.variableName);
    }
}
