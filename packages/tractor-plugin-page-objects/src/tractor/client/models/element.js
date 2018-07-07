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

            this.isGroup = false;
            this.name = '';
            this.selector = '';

            this.removeType();
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        get meta () {
            return this.name ? this._toMeta() : null;
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

                if (this.isGroup) {
                    template = `
                        this.<%= element %> = function (groupSelector) {
                            return new <%= type %>(findAll(by.css(<%= selector %>)).getFromGroup(groupSelector));
                        };
                    `;
                } else {
                    template = `
                        this.<%= element %> = new <%= type %>(find(by.css(<%= selector %>)));
                    `;
                }
            } else {
                if (this.isGroup) {
                    template = `
                        this.<%= element %> = function (groupSelector) {
                            return findAll(by.css(<%= selector %>)).getFromGroup(groupSelector);
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
            return {
                name: this.name
            };
        }
    };
}

PageObjectsModule.factory('ElementModel', createElementModelConstructor);
