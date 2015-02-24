'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ComponentInstanceModel');
require('./MockDataInstanceModel');

var createStepDefinitionModelConstructor = function (
    ASTCreatorService,
    ComponentInstanceModel,
    MockDataInstanceModel
) {
    var StepDefinitionModel = function StepDefinitionModel (fileName, availableComponents, availableMockData) {
        this.name = fileName.replace('.step.js', '');

        this.availableComponents = availableComponents;
        this.availableMockData = availableMockData;

        this.components = [];
        this.componentInstances = [];

        this.mockData = [];
        this.mockDataInstances = [];

        Object.defineProperty(this, 'ast', {
            get: function () {
                return this.toAST();
            }
        });
    };

    StepDefinitionModel.prototype.addComponent = function (name) {
        var component = _.find(this.availableComponents, function (component) {
            return component.name === name;
        });
        if (!_.contains(this.components, component)) {
            this.components.push(component);
            this.componentInstances.push(new ComponentInstanceModel(component));
        }
    };

    StepDefinitionModel.prototype.removeComponent = function (component) {
        var index = _.indexOf(this.componentInstances, component);
        _.remove(this.componentInstances, component);
        this.components.splice(index, 1);
    };

    StepDefinitionModel.prototype.addMock = function (name) {
        var mockData = _.find(this.availableMockData, function (mockData) {
            return mockData.name === name;
        });
        if (!_.contains(this.mockData, mockData)) {
            this.mockData.push(mockData);
            this.mockDataInstances.push(new MockDataInstanceModel(mockData));
        }
    };

    StepDefinitionModel.prototype.removeMock = function (mockData) {
        var index = _.indexOf(this.mockDataInstances, mockData);
        _.remove(this.mockDataInstances, mockData);
        this.mockData.splice(index, 1);
    };

    StepDefinitionModel.prototype.toAST = function () {
        var ast = ASTCreatorService;

        var components = _.map(this.componentInstances, function (component) {
            return component.ast;
        });

        var mockData = _.map(this.mockDataInstances, function (mockData) {
            return mockData.ast;
        });

        var moduleBody = _.flatten([components, mockData, this.step.ast]);

        var moduleBlockStatement = ast.blockStatement(moduleBody);
        var moduleFunctionExpression = ast.functionExpression(null, null, moduleBlockStatement);

        var moduleExportsMemberExpression = ast.memberExpression(ast.identifier('module'), ast.identifier('exports'));

        var componentModuleAssignmentExpression = ast.assignmentExpression(moduleExportsMemberExpression, ast.AssignmentOperators.ASSIGNMENT, moduleFunctionExpression);
        var componentModuleExpressionStatement = ast.expressionStatement(componentModuleAssignmentExpression);

        return ast.program([componentModuleExpressionStatement]);
    };

    return StepDefinitionModel;
};

StepDefinitionEditor.factory('StepDefinitionModel', function (
    ASTCreatorService,
    ComponentInstanceModel,
    MockDataInstanceModel
) {
    return createStepDefinitionModelConstructor(ASTCreatorService, ComponentInstanceModel, MockDataInstanceModel);
});
