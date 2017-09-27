// Utilities:
import pascalcase from 'pascal-case';

// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/action';
import '../models/element';

function createPageObjectModelConstructor (
    ActionModel,
    ElementModel,
    astCreatorService,
    plugins,
) {
    let PageObjectModel = function PageObjectModel (options) {
        let elements = plugins.slice(0);
        let domElements = [];
        let actions = [];

        Object.defineProperties(this, {
            isSaved: {
                get () {
                    return !!(options && options.isSaved);
                }
            },
            file: {
                get () {
                    return options && options.file;
                }
            },
            plugins: {
                get () {
                    return plugins;
                }
            },
            domElements: {
                get () {
                    return domElements;
                }
            },
            actions: {
                get () {
                    return actions;
                }
            },
            elements: {
                get () {
                    return elements;
                }
            },
            variableName: {
                get () {
                    return pascalcase(this.name);
                }
            },
            meta: {
                get () {
                    return JSON.stringify({
                        name: this.name,
                        elements: this.domElements.map(element => element.meta),
                        actions: this.actions.map(action => action.meta)
                    });
                }
            },
            ast: {
                get () {
                    return toAST.call(this);
                }
            },
            data: {
                get () {
                    return this.ast;
                }
            }
        });

        this.name = '';
    };

    PageObjectModel.prototype.addElement = function () {
        let element = new ElementModel(this);
        element.addFilter();
        this.elements.push(element);
        this.domElements.push(element);
    };

    PageObjectModel.prototype.removeElement = function (toRemove) {
        if (this.elements.includes(toRemove)) {
            this.elements.splice(this.elements.indexOf(toRemove), 1);
        }
        if (this.domElements.includes(toRemove)) {
            this.domElements.splice(this.domElements.indexOf(toRemove), 1);
        }
    };

    PageObjectModel.prototype.addAction = function () {
        let action = new ActionModel(this);
        this.actions.push(action);
        action.addInteraction();
    };

    PageObjectModel.prototype.removeAction = function (toRemove) {
        if (this.actions.includes(toRemove)) {
            this.actions.splice(this.actions.indexOf(toRemove), 1);
        }
    };

    PageObjectModel.prototype.getAllVariableNames = function (currentObject) {
        currentObject = currentObject || this;
        return [this].concat(this.elements, this.actions)
        .filter(object => object !== currentObject)
        .map(object => object.variableName)
        .filter(Boolean);
    };

    return PageObjectModel;

    function toAST () {
        let ast = astCreatorService;

        let pageObject = ast.identifier(this.variableName);
        let elements = this.domElements.map(element => ast.expressionStatement(element.ast));
        let actions = this.actions.map(action => ast.expressionStatement(action.ast));

        let template = '';
        template += 'module.exports = (function () {';
        template += '    var <%= pageObject %> = function <%= pageObject %> () {';
        template += '        %= elements %;';
        template += '    };';
        template += '    %= actions %;';
        template += '    return <%= pageObject %>';
        template += '})();'

        return ast.file(ast.expression(template, {
            pageObject,
            elements,
            actions
        }), this.meta);
    }
}

PageObjectsModule.factory('PageObjectModel', createPageObjectModelConstructor);
