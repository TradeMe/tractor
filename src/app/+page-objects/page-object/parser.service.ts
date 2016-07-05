'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as assert from 'assert';

// Dependencies:
import { ActionParserService, ACTION_PARSER_PROVIDERS } from '../action/parser.service';
import { ASTService, AST_PROVIDERS } from '../../shared/ast/ast.service';
import { ElementParserService, ELEMENT_PARSER_PROVIDERS } from '../element/parser.service';
// import PersistentStateService from '../../../Core/Services/PersistentStateService';
import { PageObject, PageObjectFactory, PAGE_OBJECT_PROVIDERS } from '../page-object/page-object';
import { Parser } from '../../shared/parser/parser.interface';

@Injectable()
export class PageObjectParserService implements Parser<PageObject> {
    constructor (
        private actionParserService: ActionParserService,
        private astService: ASTService,
        private elementParserService: ElementParserService,
        private pageObjectFactory: PageObjectFactory
        // persistentStateService
    ) { }

    parse (pageObjectFile): PageObject {
        let { ast } = pageObjectFile;
        try {
            let [metaComment] = ast.comments;
            let meta = JSON.parse(metaComment.value);

            let pageObject = this.pageObjectFactory.create({
                isSaved: true,
                path: pageObjectFile.path
            });
            pageObject.name = meta.name;

            let state = null; // this.persistentStateService.get(component.name);
            let [pageObjectModuleExpressionStatement] = ast.body;
            let moduleBlockStatement = pageObjectModuleExpressionStatement.expression.right.callee.body;

            let statements = moduleBlockStatement.body;
            let parsers = [this.parseElements, this.parseAction, this.parseReturnStatement];
            this.tryParse(pageObject, statements, meta, state, parsers);

            return pageObject;
        } catch (e) {
            console.warn('Invalid page object:', this.astService.toJS(ast));
            return null;
        }
    }

    private tryParse (pageObject, statements, meta, state, parsers): void {
        statements.forEach(statement => {
            let parsed = parsers.some(parser => {
                try {
                    return parser.call(this, pageObject, statement, meta, state);
                } catch (e) {}
            });
            if (!parsed) {
                throw new Error();
            }
        });
    }

    private parseElements (pageObject, statement, meta, state): boolean {
        let [constructorDeclarator] = statement.declarations;
        let constructorBlockStatement = constructorDeclarator.init.body;
        constructorBlockStatement.body.forEach((statement) => {
            this.parseElement(pageObject, statement, meta, state);
        });
        return true;
    }

    private parseElement (pageObject, statement, meta, state): void {
        let domElement = this.elementParserService.parse(pageObject, statement);
        assert(domElement);
        domElement.name = meta.elements[pageObject.domElements.length].name;
        // domElement.minimised = !!state[domElement.name];
        pageObject.elements.push(domElement);
        pageObject.domElements.push(domElement);
    }

    private parseAction (pageObject, statement, meta, state): boolean {
        let actionMeta = meta.actions[pageObject.actions.length];
        assert(statement.expression);
        let action = this.actionParserService.parse(pageObject, statement, actionMeta);
        assert(action);
        action.name = actionMeta.name;
        // action.minimised = !!state[action.name];
        pageObject.actions.push(action);
        return true;
    }

    private parseReturnStatement (pageObject, statement): boolean {
        assert(statement.argument.name === pageObject.variableName);
        return true;
    }
}

export const PAGE_OBJECT_PARSER_PROVIDERS = [
    PageObjectParserService,
    ACTION_PARSER_PROVIDERS,
    AST_PROVIDERS,
    ELEMENT_PARSER_PROVIDERS,
    PAGE_OBJECT_PROVIDERS
];
