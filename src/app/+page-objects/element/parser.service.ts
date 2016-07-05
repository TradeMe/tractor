'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as assert from 'assert';

// Dependencies:
import { ASTService, AST_PROVIDERS } from '../../shared/ast/ast.service';
import { Element, ElementFactory, ELEMENT_PROVIDERS } from './element';
import { FilterParserService, FILTER_PARSER_PROVIDERS } from '../filter/parser.service';
import { PageObject } from '../page-object/page-object';
import { Parser } from '../../shared/parser/parser.interface';

@Injectable()
export class ElementParserService implements Parser<Element> {
    constructor (
        private astService: ASTService,
        private elementFactory: ElementFactory,
        private filterParserService: FilterParserService
    ) { }

    public parse (pageObject: PageObject, ast, element?): Element {
        try {
            if (!element) {
                element = this.elementFactory.create(pageObject);
            }

            let parseState = {
                callee: ast.expression.right.callee,
                expression: ast.expression.right
            };

            let parsers = [this.parseNestedElement, this.parseFirstElement, this.parseFirstElementAll, this.parseElement, this.parseElementAll, this.parseFilter, this.parseGet];
            this.tryParse(pageObject, element, parseState, parsers);

            return element;
        } catch (e) {
            console.warn('Invalid element:', this.astService.toJS(ast))
            return null;
        }
    }

    private tryParse (pageObject: PageObject, element: Element, parseState, parsers): void {
        let parsed = parsers.some(parser => {
            try {
                return parser.call(this, pageObject, element, parseState);
            } catch (e) {}
        });
        if (!parsed) {
            throw new Error();
        }
    }

    private parseNestedElement (pageObject: PageObject, element: Element, parseState): Element {
        let { callee, expression } = parseState;
        assert(callee.object.callee);

        try {
            assert(callee.object.callee.property.name === 'filter');
            parseState.callee = callee.object.callee;
            parseState.expression = expression.callee.object;
        } catch (e) {}

        return this.parse(pageObject, {
            expression: {
                right: parseState.callee.object
            }
        }, element);
    }

    private parseFirstElement (pageObject: PageObject, element: Element, parseState): boolean {
        let { callee, expression } = parseState;
        assert(callee.name === 'element');
        let [filterAST] = expression.arguments;
        let filter = this.filterParserService.parse(element, filterAST);
        element.addFilter(filter);
        return true;
    }

    private parseFirstElementAll (pageObject: PageObject, element: Element, parseState): boolean {
        let { callee, expression } = parseState;
        assert(callee.object.name === 'element');
        assert(callee.property.name === 'all');
        let [filterAllAST] = expression.arguments;
        let filter = this.filterParserService.parse(element, filterAllAST);
        element.addFilter(filter);
        return true;
    }

    private parseElement (pageObject: PageObject, element: Element, parseState): boolean {
        let { callee, expression } = parseState;
        assert(callee.property.name === 'element');
        let [filterAST] = expression.arguments;
        let filter = this.filterParserService.parse(element, filterAST);
        element.addFilter(filter);
        return true;
    }

    private parseElementAll (pageObject: PageObject, element: Element, parseState): boolean {
        let { callee, expression } = parseState;
        assert(callee.property.name === 'all');
        let [filterAllAST] = expression.arguments;
        let filter = this.filterParserService.parse(element, filterAllAST);
        element.addFilter(filter);
        return true;
    }

    private parseFilter (pageObject: PageObject, element: Element, parseState): boolean {
        let { callee, expression } = parseState;
        assert(callee.property.name === 'filter');
        let [filterAST] = expression.arguments;
        let filter = this.filterParserService.parse(element, filterAST);
        element.addFilter(filter);
        return true;
    }

    private parseGet (pageObject: PageObject, element: Element, parseState): boolean {
        let { callee, expression } = parseState;
        assert(callee.property.name === 'get');
        let [filterAST] = expression.arguments;
        let filter = this.filterParserService.parse(element, filterAST);
        element.addFilter(filter);
        return true;
    }
}

export const ELEMENT_PARSER_PROVIDERS = [
    ElementParserService,
    AST_PROVIDERS,
    ELEMENT_PROVIDERS,
    FILTER_PARSER_PROVIDERS
];
