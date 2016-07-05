'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as camelcase from 'camel-case';

// Dependencies:
import { ASTService, AST_PROVIDERS } from '../../shared/ast/ast.service';
import {
    CLICK,
    SEND_KEYS,
    GET_TEXT,
    IS_ENABLED,
    IS_SELECTED,
    SUBMIT,
    CLEAR,
    IS_DISPLAYED,
    GET_OUTER_HTML,
    GET_INNER_HTML
} from './element-methods';
import { Factory } from '../../shared/factory/factory.interface';
import { Filter, FilterFactory, FILTER_PROVIDERS } from '../filter/filter';
import { PageObject } from '../page-object/page-object';
import { StringToLiteralService, STRING_TO_LITERAL_PROVIDERS } from '../../shared/string-to-literal/string-to-literal.service';

@Injectable()
export class ElementFactory implements Factory<Element> {
    constructor (
        private astService: ASTService,
        private filterFactory: FilterFactory,
        private stringToLiteralService: StringToLiteralService
    ) { }

    public create (pageObject: PageObject): Element {
        let instance = new Element(pageObject);
        instance.setServices(this.astService, this.filterFactory, this.stringToLiteralService);
        return instance;
    }
}

export class Element {
    private _filters: Array<Filter> = [];
    private _pageObject: PageObject;
    private _sortableFilters: Array<Filter> = [];

    private astService: ASTService;
    private filterFactory: FilterFactory;
    private stringToLiteralService: StringToLiteralService;

    public name: string = '';
    public methods: Array<any> = [
        CLICK,
        SEND_KEYS,
        GET_TEXT,
        IS_ENABLED,
        IS_SELECTED,
        SUBMIT,
        CLEAR,
        IS_DISPLAYED,
        GET_OUTER_HTML,
        GET_INNER_HTML
    ];

    public get filters (): Array<Filter> {
        return this._filters;
    }

    public get pageObject (): PageObject {
        return this._pageObject;
    }

    public get selector (): Filter {
        let [filter] = this.filters;
        return filter;
    }

    public get sortableFilters (): Array<Filter> {
        return this._sortableFilters;
    }

    public get variableName (): string {
        return camelcase(this.name);
    }

    public get meta () {
        return {
            name: this.name
        };
    }

    public get ast () {
        return this.toAST();
    }

    constructor (pageObject: PageObject) {
        this._pageObject = pageObject;
    }

    public addFilter (filter?: Filter): void {
        if (!filter) {
            filter = this.filterFactory.create(this);
        }
        this.filters.push(filter);
        if (this.filters.length > 1) {
            this.sortableFilters.push(filter);
        }
    }

    public getAllVariableNames (): Array<string> {
        return this.pageObject.getAllVariableNames(this);
    }

    public removeFilter (toRemove: Filter): void {
        this.filters.splice(this.filters.findIndex(filter => {
            return filter === toRemove;
        }), 1);
        this.sortableFilters.splice(this.sortableFilters.findIndex(sortableFilter => {
            return sortableFilter === toRemove;
        }), 1);
    }

    public setServices (astService: ASTService, filterFactory: FilterFactory, stringToLiteralService: StringToLiteralService): void {
        this.astService = astService;
        this.filterFactory = filterFactory;
        this.stringToLiteralService = stringToLiteralService;
    }

    private toAST (): ESCodeGen.Statement {
        let element = this.astService.identifier(this.variableName);
        let filters = this.filtersAST();

        let template = 'this.<%= element %> = <%= filters %>;';

        return this.astService.expression(template, { element, filters });
    }

    private filtersAST (): ESCodeGen.Statement {
        let template = '';
        let fragments = {};
        this.filters.reduce((previousFilter: Filter, filter: Filter, index: number) => {
            let filterTemplate = `<%= filter${index} %>`;
            if (template.length) {
                template += this.filterAfterFilterAST(previousFilter, filter, filterTemplate);
            } else {
                template += this.filterAST(filter, filterTemplate);
            }

            fragments[`filter${index}`] = filter.ast;

            return filter;
        }, {});

        return this.astService.expression(template, fragments);
    }

    private filterAST (filter: Filter, filterTemplate: string): string {
        if (filter.isGroup) {
            return `element.all(${filterTemplate})`;
        } else {
            return `element(${filterTemplate})`;
        }
    }

    private filterAfterFilterAST (previousFilter: Filter, filter: Filter, filterTemplate: string): string {
        if (previousFilter.isGroup) {
            filter.isNested = true;
            return this.filterAfterGroupFilter(filter, filterTemplate);
        } else {
            return this.filterAfterSingleFilter(filter, filterTemplate);
        }
    }

    private filterAfterGroupFilter (filter: Filter, filterTemplate: string): string {
        let locatorLiteral = this.stringToLiteralService.toLiteral(filter.locator);
        if (isNumber(locatorLiteral)) {
            return `.get(${filterTemplate})`;
        } else {
            return `.filter(${filterTemplate}).get(0)`;
        }
    }

    private filterAfterSingleFilter (filter: Filter, filterTemplate: string): string {
        if (filter.isGroup) {
            return `.all(${filterTemplate})`;
        } else {
            return `.element(${filterTemplate})`;
        }
    }
};

export const ELEMENT_PROVIDERS = [
    ElementFactory,
    AST_PROVIDERS,
    FILTER_PROVIDERS,
    STRING_TO_LITERAL_PROVIDERS
];

// TODO: Use angular utilities:
function isNumber(obj: any): boolean {
    return typeof obj === "number";
}
