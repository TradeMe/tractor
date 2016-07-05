'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as dedent from 'dedent';

// Dependencies:
import { ASTService, AST_PROVIDERS } from '../../shared/ast/ast.service';
import { Element } from '../element/element';
import { Factory } from '../../shared/factory/factory.interface';
import { StringToLiteralService, STRING_TO_LITERAL_PROVIDERS } from '../../shared/string-to-literal/string-to-literal.service';

@Injectable()
export class FilterFactory implements Factory<Filter> {
    constructor (
        private astService: ASTService,
        private stringToLiteralService: StringToLiteralService
    ) { }

    public create (element: Element): Filter {
        let instance = new Filter(element);
        instance.setServices(this.astService, this.stringToLiteralService);
        return instance;
    }
}

export class Filter {
    private _element: Element
    private _types: Array<string> = ['model', 'binding', 'text', 'css', 'options', 'repeater'];

    public isNested: boolean = false;
    public locator: string = '';
    public type: string;

    private astService: ASTService;
    private stringToLiteralService: StringToLiteralService;

    public get element (): Element {
        return this._element;
    }

    public get types (): Array<string> {
        return this._types;
    }

    public get isGroup (): boolean {
        return this.type === 'options' || this.type === 'repeater';
    }

    public get isText (): boolean {
        return this.type === 'text';
    }

    public get ast (): ESCodeGen.Statement {
        return this.toAST();
    }

    constructor (element: Element) {
        this._element = element;

        let [type] = this.types
        this.type = type;
    }

    public setServices (astService: ASTService, stringToLiteralService: StringToLiteralService) {
        this.astService = astService;
        this.stringToLiteralService = stringToLiteralService;
    }

    private toAST (): ESCodeGen.Statement {
        if (this.isNested) {
            return this.toNestedAST();
        } else {
            return this.toSingleAST();
        }
    }

    private toNestedAST (): ESCodeGen.Statement {
        let locator = this.astService.literal(this.locator);

        let literal = this.stringToLiteralService.toLiteral(<string>locator.value);
        if (isNumber(literal)) {
            return this.astService.literal(<number>literal);
        } else {
            let template = dedent(`
                (function (element) {
                    return element.getText().then(function (text) {
                        return text.indexOf(<%= locator %>) !== -1;
                    });
                });
            `);
            return this.astService.expression(template, { locator });
        }
    }

    private toSingleAST (): ESCodeGen.Statement {
        let locator = this.astService.literal(this.locator);
        let type = this.astService.identifier(this.type);

        let template = '';
        if (this.isText) {
            template += `by.cssContainingText('*', <%= locator %>)`;
            return this.astService.expression(template, { locator });
        } else {
            template += 'by.<%= type %>(<%= locator %>)';
            return this.astService.expression(template, { type, locator });
        }
    }
}

export const FILTER_PROVIDERS = [
    FilterFactory,
    AST_PROVIDERS,
    STRING_TO_LITERAL_PROVIDERS
];

// TODO: Use angular utilities:
function isNumber(obj: any): boolean {
    return typeof obj === "number";
}
