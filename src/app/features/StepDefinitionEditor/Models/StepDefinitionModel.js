'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ComponentInstanceModel');

var createStepDefinitionModelConstructor = function (
    ASTCreatorService,
    ComponentInstanceModel
) {
    var ast = ASTCreatorService;

    var StepDefinitionModel = function StepDefinitionModel (fileName, availableComponents) {
        this.name = fileName.replace('.step.js', '');

        this.availableComponents = availableComponents;

        this.components = [];
        this.componentInstances = [];

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

    StepDefinitionModel.prototype.toAST = function () {
        var moduleBody = _.chain(this.componentInstances)
        .map(function (component) {
            return component.ast;
        })
        .flatten().value();

        moduleBody.push(this.step.ast);

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
    ComponentInstanceModel
) {
    return createStepDefinitionModelConstructor(ASTCreatorService, ComponentInstanceModel);
});
