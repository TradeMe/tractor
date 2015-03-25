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
    var StepDefinitionModel = function StepDefinitionModel (fileName, options) {
        this.name = fileName;

        this.components = [];
        this.componentInstances = [];

        this.mockData = [];
        this.mockDataInstances = [];

        Object.defineProperties(this, {
            availableComponents: {
                get: function () {
                    return options.availableComponents;
                }
            },
            availableMockData: {
                get: function () {
                    return options.availableMockData;
                }
            },
            path: {
                get: function () {
                    return options.path;
                }
            },
            meta: {
                get: function () {
                    return JSON.stringify({
                        name: this.name,
                        components: this.componentInstances.map(function (component) {
                            return component.meta;
                        }),
                        mockData: this.mockDataInstances.map(function (mockData) {
                            return mockData.meta;
                        })
                    }, null, '    ');
                }
            },
            ast: {
                get: function () {
                    return this.toAST();
                }
            }
        });
    };

    StepDefinitionModel.prototype.addComponent = function (name) {
        var component = _.find(this.availableComponents, function (component) {
            return component.name === name;
        });
        if (!_.contains(this.components, component)) {
            this.components.push(component);
            this.componentInstances.push(new ComponentInstanceModel(component, this));
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
            this.mockDataInstances.push(new MockDataInstanceModel(mockData, this));
        }
    };

    StepDefinitionModel.prototype.removeMock = function (mockData) {
        var index = _.indexOf(this.mockDataInstances, mockData);
        _.remove(this.mockDataInstances, mockData);
        this.mockData.splice(index, 1);
    };

    StepDefinitionModel.prototype.toAST = function () {
        var ast = ASTCreatorService;

        var components = this.componentInstances.map(function (component) {
            return component.ast;
        });

        var mockData = this.mockDataInstances.map(function (mockData) {
            return mockData.ast;
        });

        var template = 'module.exports = function () { ';
        if (components) {
            template += '%= components %; ';
        }
        if (mockData) {
            template += '%= mockData %; ';
        }
        template += '%= step %; ';
        template += '};';

        var stepDefinitionAST = ast.template(template, {
            components: components,
            mockData: mockData,
            step: this.step.ast
        });
        stepDefinitionAST.expression.leadingComments = [ast.blockComment(this.meta)];
        return stepDefinitionAST;
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
