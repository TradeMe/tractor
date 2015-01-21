'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./BrowserModel');
require('./ElementModel');
require('./ActionModel');

var ComponentModel = function (
    ASTCreatorService,
    BrowserModel,
    ElementModel,
    ActionModel
) {
    var ast = ASTCreatorService;

    var DEFAULTS = {
        name: 'Component'
    };

    var ComponentModel = function ComponentModel () {
        var browser = new BrowserModel();
        var elements = [browser];
        var domElements = [];
        var actions = [];

        Object.defineProperties(this, {
            name: {
                get: function () { return this.nameIdentifier.name; },
                set: function (name) { this.nameIdentifier.name = name; }
            },
            browser: {
                get: function () { return browser; }
            },
            domElements: {
                get: function () { return domElements; }
            },
            actions: {
                get: function () { return actions; }
            },
            elements: {
                get: function () { return elements; }
            },
            ast: {
                get: function () { return toAST.call(this); }
            }
        });

        this.nameIdentifier = ast.createIdentifier(this.validateName(this, DEFAULTS.name));
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
        var action = new ActionModel(this)
        this.actions.push(action);
        action.addInteraction();
    };

    ComponentModel.prototype.removeAction = function (action) {
        _.remove(this.actions, action);
    };

    ComponentModel.prototype.validateName = function (object, name) {
        var nameToCheck = name;
        var names = getAllNames.call(this, object);
        var count = 1;
        while (_.contains(names, nameToCheck)) {
            nameToCheck = name + count;
            count += 1;
        }
        return nameToCheck;
    };

    var getAllNames = function (reject) {
        var objects = [this, this.elements, this.actions];
        return _.chain(objects).flatten().compact().reject(function (object) {
            return object === reject;
        }).map(function (object) {
            return object.name;
        }).compact().value();
    };

    var toAST = function () {
        var elementASTs = _.map(this.domElements, function (element) { return element.ast; });
        var constructorBlockExpression = ast.createBlockStatement(elementASTs);
        var constructorFunctionExpression = ast.createFunctionExpression(this.nameIdentifier, null, constructorBlockExpression);
        var constructorVariableDeclarator = ast.createVariableDeclarator(this.nameIdentifier, constructorFunctionExpression);
        var constructorVariableDeclaration = ast.createVariableDeclaration([constructorVariableDeclarator]);

        var actionASTs = _.map(this.actions, function (action) { return action.ast; });
        var moduleReturnStatement = ast.createReturnStatement(this.nameIdentifier);
        var moduleBody = _.chain([constructorVariableDeclaration, actionASTs, moduleReturnStatement]).flatten().compact().value();
        var moduleBlockStatement = ast.createBlockStatement(moduleBody);
        var moduleFunctionExpression = ast.createFunctionExpression(null, null, moduleBlockStatement);
        var moduleCallExpression =  ast.createCallExpression(moduleFunctionExpression);

        var moduleExportsMemberExpression = ast.createMemberExpression(ast.createIdentifier('module'), ast.createIdentifier('exports'));
        var componentModuleAssignmentExpression = ast.createAssignmentExpression(moduleExportsMemberExpression, ast.AssignmentOperators.ASSIGNMENT, moduleCallExpression);
        var componentModuleExpressionStatement = ast.createExpressionStatement(componentModuleAssignmentExpression);

        return ast.createProgram([componentModuleExpressionStatement]);
    };

    return ComponentModel;
};

ComponentEditor.factory('ComponentModel', function (
    ASTCreatorService,
    BrowserModel,
    ElementModel,
    ActionModel
) {
    return ComponentModel(ASTCreatorService, BrowserModel, ElementModel, ActionModel);
});
