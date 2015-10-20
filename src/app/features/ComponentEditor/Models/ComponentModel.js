'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
var pascalcase = require('change-case').pascal;
require('../../../Core/Services/ASTCreatorService');
require('./BrowserModel');
require('./ElementModel');
require('./ActionModel');

var createComponentModelConstructor = function (
    astCreatorService,
    BrowserModel,
    ElementModel,
    ActionModel
) {
    var ComponentModel = function ComponentModel (options) {
        var browser = new BrowserModel();
        var elements = [browser];
        var domElements = [];
        var actions = [];

        Object.defineProperties(this, {
            isSaved: {
                get: function () {
                    return !!(options && options.isSaved);
                }
            },
            path: {
                get: function () {
                    return options && options.path;
                }
            },
            browser: {
                get: function () {
                    return browser;
                }
            },
            domElements: {
                get: function () {
                    return domElements;
                }
            },
            actions: {
                get: function () {
                    return actions;
                }
            },
            elements: {
                get: function () {
                    return elements;
                }
            },
            variableName: {
                get: function () {
                    return pascalcase(this.name);
                }
            },
            meta: {
                get: function () {
                    return JSON.stringify({
                        name: this.name,
                        elements: this.domElements.map(function (element) {
                            return element.meta;
                        }),
                        actions: this.actions.map(function (action) {
                            return action.meta;
                        })
                    });
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            },
            data: {
                get: function () {
                    return this.ast;
                }
            }
        });

        this.name = '';
    };

    ComponentModel.prototype.addElement = function () {
        var element = new ElementModel(this);
        element.addFilter();
        this.elements.push(element);
        this.domElements.push(element);
    };

    ComponentModel.prototype.removeElement = function (toRemove) {
        _.remove(this.elements, function (element) {
            return element === toRemove;
        });
        _.remove(this.domElements, function (domElement) {
            return domElement === toRemove;
        });
    };

    ComponentModel.prototype.addAction = function () {
        var action = new ActionModel(this);
        this.actions.push(action);
        action.addInteraction();
    };

    ComponentModel.prototype.removeAction = function (toRemove) {
        _.remove(this.actions, function (action) {
            return action === toRemove;
        });
    };

    ComponentModel.prototype.getAllVariableNames = function (currentObject) {
        currentObject = currentObject || this;
        var objects = [this, this.elements, this.actions];
        return _.chain(objects).flatten().compact().reject(function (object) {
            return object === currentObject;
        }).map(function (object) {
            return object.name;
        }).compact().value();
    };

    return ComponentModel;

    function toAST () {
        var ast = astCreatorService;

        var component = ast.identifier(this.variableName);
        var elements = _.map(this.domElements, function (element) {
            return ast.expressionStatement(element.ast);
        });
        var actions = _.map(this.actions, function (action) {
            return ast.expressionStatement(action.ast);
        });

        var template = '';
        template += 'module.exports = (function () {';
        template += '    var <%= component %> = function <%= component %> () {';
        template += '        %= elements %;';
        template += '    };';
        template += '    %= actions %;';
        template += '    return <%= component %>';
        template += '})();'

        return ast.file(ast.expression(template, {
            component: component,
            elements: elements,
            actions: actions
        }), this.meta);
    }
};

ComponentEditor.factory('ComponentModel', function (
    astCreatorService,
    BrowserModel,
    ElementModel,
    ActionModel
) {
    return createComponentModelConstructor(astCreatorService, BrowserModel, ElementModel, ActionModel);
});
