'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as pascalcase from 'pascal-case';
import * as dedent from 'dedent';

// Dependencies:
import { Action, ActionFactory } from '../action/action';
import { ASTService } from '../../../shared/ast/ast.service';
import { Browser, BrowserFactory } from '../browser/browser';
import { Element, ElementFactory } from '../element/element';
import { Factory } from '../../../shared/factory/factory.interface';
import { FileStructureItem } from '../../../shared/file-structure/file-structure-item.interface';

@Injectable()
export class PageObjectFactory implements Factory<PageObject> {
    constructor (
        private actionFactory: ActionFactory,
        private astService: ASTService,
        private browserFactory: BrowserFactory,
        private elementFactory: ElementFactory
    ) { }

    public create (options?): PageObject {
        let instance = new PageObject(this.actionFactory, this.astService, this.browserFactory, this.elementFactory);
        instance.init(options);
        instance.addBrowser();
        return instance;
    }
}

export class PageObject implements FileStructureItem {
    private _actions: Array<Action> = [];
    private _browser: Browser;
    private _domElements: Array<Element> = [];
    private _elements: Array<Browser | Element> = [];
    private _options;

    public name: string = '';

    public get isSaved (): boolean {
        return !!this._options.isSaved;
    }

    public get path (): string {
        return this._options.path;
    }

    public get actions (): Array<Action> {
        return this._actions;
    }

    public get browser (): Browser {
        return this._browser;
    }

    public get domElements (): Array<Element> {
        return this._domElements;
    }

    public get elements (): Array<Browser | Element> {
        return this._elements;
    }

    public get variableName (): string {
        return pascalcase(this.name);
    }

    public get meta (): string {
        return JSON.stringify({
            name: this.name,
            elements: this.domElements.map(element => element.meta),
            actions: this.actions.map(action => action.meta)
        });
    }

    public get ast (): ESCodeGen.Program {
        return this.toAST();
    }

    public get data (): ESCodeGen.Program {
        return this.ast;
    }

    constructor (
        private actionFactory: ActionFactory,
        private astService: ASTService,
        private browserFactory: BrowserFactory,
        private elementFactory: ElementFactory
    ) { }

    public init (options = {}) {
        this._options = options;
    }

    public addAction (): void {
        let action = this.actionFactory.create(this);
        this.actions.push(action);
        action.addInteraction();
    }

    public addBrowser () {
        this._browser = this.browserFactory.create();
        this.elements.push(this._browser);
    }

    public addElement (): void {
        let element = this.elementFactory.create(this);
        element.addFilter();
        this.elements.push(element);
        this.domElements.push(element);
    }

    public getAllVariableNames (currentObject: PageObject | Element | Action): Array<string> {
        let objects: Array<PageObject | Element | Browser | Action> = [];
        objects.push(this);
        objects.push.apply(objects, this.elements);
        objects.push.apply(objects, this.actions);

        return objects
        .filter(object => object !== currentObject)
        .map(object => object.name);
    }

    public removeAction (toRemove: Action): void {
        this.actions.splice(this.actions.findIndex(action => {
            return action === toRemove;
        }), 1);
    }

    public removeElement (toRemove: Element): void {
        this.elements.splice(this.elements.findIndex(element => {
            return element === toRemove;
        }), 1);
        this.domElements.splice(this.domElements.findIndex(domElement => {
            return domElement === toRemove;
        }), 1);
    }

    private toAST (): ESCodeGen.Program {
        let component = this.astService.identifier(this.variableName);
        let elements = this.domElements.map(element => this.astService.expressionStatement(element.ast));
        let actions = this.actions.map(action => this.astService.expressionStatement(action.ast));

        let template = dedent(`
            module.exports = (function () {
                var <%= component %> = function <%= component %> () {
                    %= elements %;
                };
                %= actions %;
                return <%= component %>
            })();
        `);

        return this.astService.file(this.astService.expression(template, {
            component,
            elements,
            actions
        }), this.meta);
    }
}
