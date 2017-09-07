'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Element } from '../element/element';
import { Filter, FilterFactory } from './filter';
import { Parser } from '../../../shared/parser/parser.interface';

@Injectable()
export class FilterParserService implements Parser<Filter> {
    constructor (
        private astService: ASTService,
        private filterFactory: FilterFactory
    ) { }

    parse (element: Element, ast): Filter {
        try {
            let filter = this.filterFactory.create(element);

            let parsers = [this.parseFilter, this.parseCSSContainingTextFilter, this.parseOptionsRepeaterIndexFilter, this.parseOptionsRepeaterTextFilter];
            this.tryParse(filter, ast, parsers);

            return filter;
        } catch (e) {
            console.warn('Invalid filter:', this.astService.toJS(ast));
            return null;
        }
    }

    private tryParse (filter: Filter, ast, parsers): void {
        let parsed = parsers.some(parser => {
            try {
                return parser(filter, ast);
            } catch (e) {}
        });
        if (!parsed) {
            throw new Error();
        }
    }

    private parseFilter (filter: Filter, ast): boolean {
        assert(ast.callee.property.name !== 'cssContainingText');
        let [locatorLiteral] = ast.arguments;
        filter.locator = locatorLiteral.value;
        filter.type = ast.callee.property.name;
        return true;
    }

    private parseCSSContainingTextFilter (filter: Filter, ast): boolean {
        assert(ast.callee.property.name === 'cssContainingText');
        let [allSelectorLiteral] = ast.arguments;
        assert(allSelectorLiteral.value === '*');
        let locatorLiteral = ast.arguments[1];
        filter.locator = locatorLiteral.value;
        filter.type = 'text';
        return true;
    }

    private parseOptionsRepeaterIndexFilter (filter: Filter, ast): boolean {
        assert(isNumber(ast.value));
        filter.locator = String(ast.value);
        filter.type = 'text';
        return true;
    }

    private parseOptionsRepeaterTextFilter (filter: Filter, ast): boolean {
        let [getTextThenReturnStatement] = ast.body.body;
        let [checkFoundTextFunctionExpression] = getTextThenReturnStatement.argument.arguments;
        let [checkFoundTextReturnStatement] = checkFoundTextFunctionExpression.body.body;
        let [locatorLiteral] = checkFoundTextReturnStatement.argument.left.arguments;
        filter.locator = locatorLiteral.value;
        filter.type = 'text';
        return true;
    }
}

// TODO: Use angular utilities:
function isNumber(obj: any): boolean {
    return typeof obj === "number";
}
