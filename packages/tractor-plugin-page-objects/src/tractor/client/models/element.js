// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import camelcase from 'camel-case';
import { ELEMENT_ACTIONS } from './meta/element-actions';

function createElementModelConstructor (
    astCreatorService,
    ActionMetaModel
) {
    return class ElementModel {
        constructor (pageObject) {
            this.pageObject = pageObject;

            this.isMultiple = false;
            this.name = '';
            this.selector = '';

            this.removeType();
        }

        get ast () {
            return this._toAST();
        }

        get meta () {
            return this._toMeta();
        }

        get variableName () {
            return camelcase(this.name);
        }

        addType () {
            [this.type] = this.pageObject.availablePageObjects;
            this.actions = this.type.actions;
        }

        removeType () {
            this.type = null;
            this.actions = ELEMENT_ACTIONS.map(action => new ActionMetaModel(action));
        }

        _toAST () {
            let ast = astCreatorService;
            let element = ast.identifier(this.variableName);
            let selector = ast.literal(this.selector);
            let type = null;

            let template;
            if (this.type) {
                type = ast.identifier(this.type.variableName);

                if (this.isMultiple) {
                    template = `
                        this.<%= element %> = function (groupSelector) {
                            return new <%= type %>(find.all(by.css(<%= selector %>)).getFromGroup(groupSelector));
                        };
                    `;
                } else {
                    template = `
                        this.<%= element %> = new <%= type %>(find(by.css(<%= selector %>)));
                    `;
                }
            } else {
                if (this.isMultiple) {
                    template = `
                        this.<%= element %> = function (groupSelector) {
                            return find.all(by.css(<%= selector %>)).getFromGroup(groupSelector);
                        };
                    `;
                } else {
                    template = `
                        this.<%= element %> = find(by.css(<%= selector %>));
                    `;
                }
            }
            return ast.expression(template, { element, selector, type });
        }

        _toMeta () {
            let meta = {
                name: this.name
            };
            if (this.type) {
                meta.type = this.type.name;
            }
            return meta;
        }
    }
}

PageObjectsModule.factory('ElementModel', createElementModelConstructor);
