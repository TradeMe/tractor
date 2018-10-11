// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import camelcase from 'camel-case';
import { ELEMENT_ACTIONS } from '../models/meta/element-actions';
import './filter';

function createDeprecatedElementModelConstructor (
    ActionMetaModel,
    DeprecatedFilterModel,
    astCreatorService,
    stringToLiteralService
) {
    let ast = astCreatorService;

    let DeprecatedElementModel = function DeprecatedElementModel (pageObject) {
        Object.defineProperties(this, {
            pageObject: {
                get () {
                    return pageObject;
                }
            },
            selector: {
                get () {
                    let [firstFilter] = this.filters;
                    return firstFilter;
                }
            },
            variableName: {
                get () {
                    return camelcase(this.name);
                }
            },
            meta: {
                get () {
                    return {
                        name: this.name
                    };
                }
            },
            ast: {
                get () {
                    return this.isUnparseable || toAST.call(this);
                }
            }
        });

        this.actions = ELEMENT_ACTIONS.map(action => new ActionMetaModel(action));
        this.name = '';
        this.filters = [];
        this.sortableFilters = [];
    };

    DeprecatedElementModel.prototype.addFilter = function (filter) {
        filter = filter || new DeprecatedFilterModel(this);
        this.filters.push(filter);
        if (this.filters.length > 1) {
            this.sortableFilters.push(filter);
        }
    };

    DeprecatedElementModel.prototype.removeFilter = function (toRemove) {
        if (this.filters.includes(toRemove)) {
            this.filters.splice(this.filters.indexOf(toRemove), 1);
        }
        if (this.sortableFilters.includes(toRemove)) {
            this.sortableFilters.splice(this.sortableFilters.indexOf(toRemove), 1);
        }
    };

    DeprecatedElementModel.prototype.addType = function () {
        [this.type] = this.pageObject.availablePageObjects;
        this.actions = this.type.actions;
    };

    DeprecatedElementModel.prototype.removeType = function () {
        this.type = null;
        this.actions = ELEMENT_ACTIONS;
    };

    return DeprecatedElementModel;

    function toAST () {
        let element = ast.identifier(this.variableName);
        let filters = filtersAST.call(this);

        return ast.expression('this.<%= element %> = <%= filters %>;', { element, filters });
    }

    function filtersAST () {
        let template = '';
        let fragments = {};
        this.filters.reduce((previousFilter, filter, index) => {
            let filterTemplate = '<%= filter' + index + ' %>';
            if (!template.length) {
                template += filterAST(filter, filterTemplate);
            } else {
                template += filterAfterFilterAST(previousFilter, filter, filterTemplate);
            }

            fragments['filter' + index] = filter.ast;

            return filter;
        }, {});

        return ast.expression(template, fragments);
    }

    function filterAST (filter, filterTemplate) {
        if (filter.isGroup) {
            return 'element.all(' + filterTemplate + ')';
        } else {
            return 'element(' + filterTemplate + ')';
        }
    }

    function filterAfterFilterAST (previousFilter, filter, filterTemplate) {
        if (previousFilter.isGroup) {
            filter.isNested = true;
            return filterAfterGroupFilter(filter, filterTemplate);
        } else {
            return filterAfterSingleFilter(filter, filterTemplate);
        }
    }

    function filterAfterGroupFilter (filter, filterTemplate) {
        var locatorLiteral = stringToLiteralService.toLiteral(filter.locator);
        if (typeof locatorLiteral === 'number') {
            return '.get(' + filterTemplate + ')';
        } else {
            return '.filter(' + filterTemplate + ').get(0)';
        }
    }

    function filterAfterSingleFilter (filter, filterTemplate) {
        if (filter.isGroup) {
            return '.all(' + filterTemplate + ')';
        } else {
            return '.element(' + filterTemplate + ')';
        }
    }
}

PageObjectsModule.factory('DeprecatedElementModel', createDeprecatedElementModelConstructor);
