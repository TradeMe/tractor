// Utilities:
import camelcase from 'camel-case';

// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import './filter';

function createElementModelConstructor (
    FilterModel,
    astCreatorService,
    stringToLiteralService
) {
    let ast = astCreatorService;

    let ElementModel = function ElementModel (pageObject) {
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
                    return toAST.call(this);
                }
            }
        });

        this.name = '';
        this.filters = [];
        this.sortableFilters = [];
    };

    ElementModel.prototype.addFilter = function (filter) {
        filter = filter || new FilterModel(this);
        this.filters.push(filter);
        if (this.filters.length > 1) {
            this.sortableFilters.push(filter);
        }
    };

    ElementModel.prototype.removeFilter = function (toRemove) {
        if (this.filters.includes(toRemove)) {
            this.filters.splice(this.filters.indexOf(toRemove), 1);
        }
        if (this.sortableFilters.includes(toRemove)) {
            this.sortableFilters.splice(this.sortableFilters.indexOf(toRemove), 1);
        }
    };

    ElementModel.prototype.getAllVariableNames = function () {
        return this.pageObject.getAllVariableNames(this);
    };

    ElementModel.prototype.methods = [{
        name: 'click',
        description: 'Schedules a command to click on this element.',
        returns: 'promise'
    }, {
        name: 'sendKeys',
        description: 'Schedules a command to type a sequence on the DOM element represented by this instance.',
        arguments: [{
            name: 'keys',
            description: 'The sequence of keys to type.',
            type: 'string',
            required: true
        }],
        returns: 'promise'
    }, {
        name: 'getText',
        description: 'Get the visible (i.e. not hidden by CSS) innerText of this element, including sub-elements, without any leading or trailing whitespace.',
        returns: 'promise',
        promise: {
            name: 'text',
            type: 'string',
            required: true
        }
    }, {
        name: 'isEnabled',
        description: 'Schedules a command to query whether the DOM element represented by this instance is enabled, as dictated by the `disabled` attribute.',
        returns: 'promise',
        promise: {
            name: 'enabled',
            type: 'boolean',
            required: true
        }
    }, {
        name: 'isSelected',
        description: 'Schedules a command to query whether this element is selected.',
        returns: 'promise',
        promise: {
            name: 'selected',
            type: 'boolean',
            required: true
        }
    }, {
        name: 'submit',
        description: 'Schedules a command to submit the form containing this element (or this element if it is a FORM element). This command is a no-op if the element is not contained in a form.',
        returns: 'promise'
    }, {
        name: 'clear',
        description: 'Schedules a command to clear the {@code value} of this element. This command has no effect if the underlying DOM element is neither a text INPUT element nor a TEXTAREA element.',
        returns: 'promise'
    }, {
        name: 'isDisplayed',
        description: 'Schedules a command to test whether this element is currently displayed. If isDisplayed equal to false, it means the element is invisible on browser page, but it still be the present DOM element',
        returns: 'promise',
        promise: {
            name: 'displayed',
            type: 'boolean',
            required: true
        }
    }, {
        name: 'isPresent',
        description: 'Schedules a command to test whether this element is currently present as the DOM element.',
        returns: 'promise',
        promise: {
            name: 'present',
            type: 'boolean',
            required: true
        }
    }, {
        name: 'getOuterHtml',
        description: 'Schedules a command to retrieve the outer HTML of this element.',
        returns: 'promise',
        promise: {
            name: 'outerHtml',
            type: 'string',
            required: true
        }
    }, {
        name: 'getInnerHtml',
        description: 'Schedules a command to retrieve the inner HTML of this element.',
        returns: 'promise',
        promise: {
            name: 'innerHtml',
            type: 'string',
            required: true
        }
    }, {
        name: 'getAttribute',
        description: 'Schedules a command to get attribute of this element.',
        returns: 'promise',
        arguments: [{
            name: 'attribute',
            description: 'key of element attribute',
            type: 'string',
            required: true
        }],
    }, {
        name: 'selectOptionIndex',
        description: '(tractor) Schedules a command to select an <option> by index.',
        returns: 'promise',
        arguments: [{
            name: 'index',
            description: 'index of the <option> to select',
            type: 'number',
            required: true
        }],
    }, {
        name: 'selectOptionText',
        description: '(tractor) Schedules a command to select an <option> by text.',
        returns: 'promise',
        arguments: [{
            name: 'text',
            description: 'text of the <option> to select',
            type: 'string',
            required: true
        }],
    }];

    return ElementModel;

    function toAST () {
        let element = ast.identifier(this.variableName);
        let filters = filtersAST.call(this);

        let template = 'this.<%= element %> = <%= filters %>;';

        return ast.expression(template, { element, filters });
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

PageObjectsModule.factory('ElementModel', createElementModelConstructor);
