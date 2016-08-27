'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as dedent from 'dedent';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Element } from '../element/element';
import { Factory } from '../../../shared/factory/factory.interface';
import { StringToLiteralService } from '../../../shared/string-to-literal/string-to-literal.service';

@Injectable()
export class FilterFactory implements Factory<Filter> {
    constructor (
        private astService: ASTService,
        private stringToLiteralService: StringToLiteralService
    ) { }

    public create (element: Element): Filter {
        let instance = new Filter(this.astService, this.stringToLiteralService);
        instance.init(element);
        return instance;
    }
}

export class Filter {
    private _element: Element
    private _types: Array<string> = ['model', 'binding', 'text', 'css', 'options', 'repeater'];

    public isNested: boolean = false;
    public locator: string = '';
    public type: string;

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

    constructor (
        private astService: ASTService,
        private stringToLiteralService: StringToLiteralService
    ) { }

    public init (element: Element) {
        this._element = element;

        let [type] = this.types
        this.type = type;
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

// TODO: Use angular utilities:
function isNumber(obj: any): boolean {
    return typeof obj === "number";
}
