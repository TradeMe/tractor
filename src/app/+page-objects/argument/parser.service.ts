'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as assert from 'assert';

// Dependencies:
import { Argument, ArgumentFactory, ARGUMENT_PROVIDERS } from './argument';
import { ASTService, AST_PROVIDERS } from '../../shared/ast/ast.service';
import { Method } from '../method/method';
import { Parser } from '../../shared/parser/parser.interface';

@Injectable()
export class ArgumentParserService implements Parser<Argument> {
    constructor (
        private argumentFactory: ArgumentFactory,
        private astService: ASTService
    ) { }

    public parse (method: Method, argument, ast): Argument {
        try {
            argument = this.argumentFactory.create(method, argument);
            this.parseValue(argument, ast);

            return argument;
        } catch (e) {
            console.warn('Invalid argument:', this.astService.toJS(ast));
            return null;
        }
    }

    private parseValue (argument: Argument, ast): void {
        argument.value = ast.name || ast.value;
        assert(argument.value !== undefined);
    }
}

export const ARGUMENT_PARSER_PROVIDERS = [
    ArgumentParserService,
    ARGUMENT_PROVIDERS,
    AST_PROVIDERS
];
