/* global Set:true */

// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import pascalcase from 'pascal-case';
import * as path from 'path';
import '../models/action';
import '../models/element';

function createPageObjectModelConstructor (
    ActionModel,
    ElementModel,
    PageObjectMetaModel,
    astCreatorService,
    config,
    plugins
) {
    return class PageObjectModel {
        constructor (file) {
            this.file = file;

            this.plugins = this._getPluginsWithActions(plugins);
            this.elements = this.plugins;
            this.browser = this._getBrowser(this.elements);

            this.domElements = [];
            this.actions = [];

            this.name = '';
        }

        get ast () {
            return this._toAST();
        }

        get data () {
            return this.ast;
        }

        get meta () {
            return this._toMeta();
        }

        get variableName () {
            return pascalcase(this.name);
        }

        addElement () {
            let element = new ElementModel(this);
            this.elements.push(element);
            this.domElements.push(element);
        }

        removeElement (toRemove) {
            if (this.elements.includes(toRemove)) {
                this.elements.splice(this.elements.indexOf(toRemove), 1);
            }
            if (this.domElements.includes(toRemove)) {
                this.domElements.splice(this.domElements.indexOf(toRemove), 1);
            }
        }

        addAction () {
            let action = new ActionModel(this);
            this.actions.push(action);
            action.addInteraction();
        }

        removeAction (toRemove) {
            if (this.actions.includes(toRemove)) {
                this.actions.splice(this.actions.indexOf(toRemove), 1);
            }
        }

        _toMeta () {
            return JSON.stringify({
                name: this.name,
                elements: this.domElements.map(element => element.meta),
                actions: this.actions.map(action => action.meta),
                version: this._getPageObjectsVersion(plugins)
            });
        }

        _toAST () {
            let ast = astCreatorService;

            let importTemplate = 'var <%= variableName %> = require(<%= url %>);';
            let types = Array.from(new Set(this.domElements.filter(element => element.type).map(element => element.type)));
            let imports = types.map(type => {
                let variableName = ast.identifier(type.variableName);
                let url = ast.literal(this._getRelativePath(type));
                return ast.expression(importTemplate, { variableName, url })
            });

            let pageObject = ast.identifier(this.variableName);
            let elements = this.domElements.map(element => ast.expressionStatement(element.ast));
            let actions = this.actions.map(action => ast.expressionStatement(action.ast));

            let template = `
                module.exports = (function () {
                    %= imports %
            `
            if (elements.length) {
                template += `
                    var <%= pageObject %> = function <%= pageObject %> (parent) {
                        var find = parent ? parent.element.bind(parent) : element;
                        %= elements %;
                    };
                `;
            } else {
                template += `
                    var <%= pageObject %> = function <%= pageObject %> () {};
                `;
            }
            template += `
                    %= actions %;
                    return <%= pageObject %>;
                })();
            `;

            return ast.file(ast.expression(template, { imports, pageObject, elements, actions }), this.meta);
        }

        _getRelativePath (pageObject) {
            let pageObjectsDirectory = config.pageObjects.directory;
            let pageObjectPath = path.join(pageObjectsDirectory, pageObject.url);
            let relative = path.relative(path.dirname(path.join(pageObjectsDirectory, this.file.url)), pageObjectPath);
            if (!relative.match(/^\./)) {
                relative = `./${relative}`;
            }
            return relative;
        }

        _getPageObjectsVersion (plugins) {
            return plugins.find(plugin => plugin.name === 'Page Objects').version;
        }

        _getPluginsWithActions (plugins) {
            return plugins.slice(0)
            .filter(plugin => {
                return plugin.actions && plugin.actions.length;
            })
            .map(plugin => {
                let { actions, name } = plugin;
                plugin.meta = { actions, elements: [], name };
                return new PageObjectMetaModel(plugin);
            });
        }

        _getBrowser (elements) {
            let browser = elements.find(element => element.name === 'Browser');
            browser.variableName = 'browser';
            return browser;
        }
    }
}

PageObjectsModule.factory('PageObjectModel', createPageObjectModelConstructor);
