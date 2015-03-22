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
    ASTCreatorService,
    BrowserModel,
    ElementModel,
    ActionModel
) {
    var ComponentModel = function ComponentModel (options) {
        var browser = new BrowserModel();
        var elements = [browser];
        var domElements = [];
        var actions = [];
        this.isSaved = !!(options && options.isSaved);

        Object.defineProperties(this, {
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
                    }, null, '    ');
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
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

    ComponentModel.prototype.removeElement = function (element) {
        _.remove(this.elements, element);
        _.remove(this.domElements, element);
    };

    ComponentModel.prototype.addAction = function () {
        var action = new ActionModel(this);
        this.actions.push(action);
        action.addInteraction();
    };

    ComponentModel.prototype.removeAction = function (action) {
        _.remove(this.actions, action);
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
        var ast = ASTCreatorService;

        var nameIdentifier = ast.identifier(this.variableName);
        var moduleReturnStatement = ast.returnStatement(nameIdentifier);

        var elementASTs = _.map(this.domElements, function (element) {
            return element.ast;
        });

        var constructorBlockStatament = ast.blockStatement(elementASTs);
        var constructorFunctionExpression = ast.functionExpression(nameIdentifier, null, constructorBlockStatament);
        var constructorVariableDeclarator = ast.variableDeclarator(nameIdentifier, constructorFunctionExpression);
        var constructorVariableDeclaration = ast.variableDeclaration([constructorVariableDeclarator]);

        var actionASTs = _.map(this.actions, function (action) {
            return action.ast;
        });

        var moduleBody = _.chain([constructorVariableDeclaration, actionASTs, moduleReturnStatement]).flatten().compact().value();
        var moduleBlockStatement = ast.blockStatement(moduleBody);
        var moduleFunctionExpression = ast.functionExpression(null, null, moduleBlockStatement);
        var moduleCallExpression = ast.callExpression(moduleFunctionExpression);

        var moduleExportsMemberExpression = ast.memberExpression(ast.identifier('module'), ast.identifier('exports'));
        var componentModuleAssignmentExpression = ast.assignmentExpression(moduleExportsMemberExpression, ast.AssignmentOperators.ASSIGNMENT, moduleCallExpression);
        var componentModuleExpressionStatement = ast.expressionStatement(componentModuleAssignmentExpression);
        componentModuleAssignmentExpression.leadingComments = [ast.blockComment(this.meta)];

        return ast.program([componentModuleExpressionStatement]);
    }
};

ComponentEditor.factory('ComponentModel', function (
    ASTCreatorService,
    BrowserModel,
    ElementModel,
    ActionModel
) {
    return createComponentModelConstructor(ASTCreatorService, BrowserModel, ElementModel, ActionModel);
});
