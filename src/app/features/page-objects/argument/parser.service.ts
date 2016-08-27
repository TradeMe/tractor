'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Argument, ArgumentFactory } from './argument';
import { ASTService } from '../../../shared/ast/ast.service';
import { Method } from '../method/method';
import { Parser } from '../../../shared/parser/parser.interface';

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
