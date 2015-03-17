'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
var camelcase = require('change-case').camel;
require('../../../Core/Services/ASTCreatorService');
require('../../../Core/Services/StringToLiteralService');
require('./FilterModel');

var createElementModelConstructor = function (
    ASTCreatorService,
    StringToLiteralService,
    FilterModel
) {
    var ElementModel = function ElementModel (component) {
        Object.defineProperties(this, {
            component: {
                get: function () {
                    return component;
                }
            },
            selector: {
                get: function () {
                    return _.first(this.filters);
                }
            },
            variableName: {
                get: function () {
                    return camelcase(this.name);
                }
            },
            meta: {
                get: function () {
                    return {
                        name: this.name
                    };
                }
            },
            ast: {
                get: function () {
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

    ElementModel.prototype.removeFilter = function (filter) {
        _.remove(this.filters, filter);
        _.remove(this.sortableFilters, filter);
    };

    ElementModel.prototype.getAllVariableNames = function () {
        return this.component.getAllVariableNames(this);
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
        description: 'Schedules a command to test whether this element is currently displayed.',
        returns: 'promise',
        promise: {
            name: 'displayed',
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
    }];

    return ElementModel;

    function toAST () {
        var ast = ASTCreatorService;

        var elementCallExpression;
        var elementIdentifier = ast.identifier('element');
        var allIdentifier = ast.identifier('all');
        _.each(this.filters, function (filter, index) {
            var elementCallExpressionCallee;
            if (elementCallExpression) {
                var previousFilter = this.filters[index - 1];
                if (previousFilter.isAll) {
                    var getIdentifier = ast.identifier('get');
                    var locatorLiteral = StringToLiteralService.toLiteral(filter.locator);
                    if (_.isNumber(locatorLiteral)) {
                        elementCallExpressionCallee = ast.memberExpression(elementCallExpression, getIdentifier);
                        elementCallExpression = ast.callExpression(elementCallExpressionCallee, [filter.allAst]);
                    } else {
                        var filterIdentifier = ast.identifier('filter');
                        elementCallExpressionCallee = ast.memberExpression(elementCallExpression, filterIdentifier);
                        elementCallExpression = ast.callExpression(elementCallExpressionCallee, [filter.allAst]);
                        elementCallExpressionCallee = ast.memberExpression(elementCallExpression, getIdentifier);
                        elementCallExpression = ast.callExpression(elementCallExpressionCallee, [ast.literal(0)]);
                    }
                } else {
                    if (filter.isAll) {
                        elementCallExpressionCallee = ast.memberExpression(elementCallExpression, allIdentifier);
                    } else {
                        elementCallExpressionCallee = ast.memberExpression(elementCallExpression, elementIdentifier);
                    }
                    elementCallExpression = ast.callExpression(elementCallExpressionCallee, [filter.ast]);
                }
            } else {
                if (filter.isAll) {
                    elementCallExpressionCallee = ast.memberExpression(elementIdentifier, allIdentifier);
                } else {
                    elementCallExpressionCallee = elementIdentifier;
                }
                elementCallExpression = ast.callExpression(elementCallExpressionCallee, [filter.ast]);
            }
        }, this);

        var thisElementMemberExpression = ast.memberExpression(ast.thisExpression(), ast.identifier(this.variableName));
        var elementAssignmentExpression = ast.assignmentExpression(thisElementMemberExpression, ast.AssignmentOperators.ASSIGNMENT, elementCallExpression);
        return ast.expressionStatement(elementAssignmentExpression);
    }
};

ComponentEditor.factory('ElementModel', function (
    ASTCreatorService,
    StringToLiteralService,
    FilterModel
) {
    return createElementModelConstructor(ASTCreatorService, StringToLiteralService, FilterModel);
});
