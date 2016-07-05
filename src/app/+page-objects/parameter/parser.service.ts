'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Action } from '../action/action';
import { Parameter, ParameterFactory, PARAMETER_PROVIDERS } from '../parameter/parameter';
import { Parser } from '../../shared/parser/parser.interface';

@Injectable()
export class ParameterParserService implements Parser<Parameter> {
    constructor (
        private parameterFactory: ParameterFactory
    ) { }

    public parse (action: Action): Parameter {
        return this.parameterFactory.create(action);
    }
}

export const PARAMETER_PARSER_PROVIDERS = [
    ParameterParserService,
    PARAMETER_PROVIDERS
];
