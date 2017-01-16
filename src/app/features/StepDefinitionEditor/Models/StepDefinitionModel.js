'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ComponentInstanceModel');
require('./MockDataInstanceModel');
require('../../../Core/Components/Notifier/NotifierService.js')

var createStepDefinitionModelConstructor = function (
    astCreatorService,
    ComponentFileService,
    MockDataFileService,
    ComponentInstanceModel,
    MockDataInstanceModel,
    notifierService
) {
    var StepDefinitionModel = function StepDefinitionModel (options) {
        this.components = [];
        this.componentInstances = [];

        this.mockData = [];
        this.mockDataInstances = [];
        this.notifierService = notifierService;

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

        this.mockDataName = '';
        this.componentName = '';
    };

    StepDefinitionModel.prototype.addComponent = function (name) {      
        var component = _.find(this.availableComponents, function (component) {
            return component.name === name;
        });
        if (component && !_.contains(this.components, component)) {
            this.components.push(component);
            this.componentInstances.push(new ComponentInstanceModel(component, this));
        } else {
            this.notifierService.error("Component " + name + " doesnot exists");
        }
        this.componentName = '';
    };

    StepDefinitionModel.prototype.removeComponent = function (toRemove) {
        var index = _.indexOf(this.componentInstances, toRemove);
        _.remove(this.componentInstances, function (component) {
            return component === toRemove;
        });
        this.components.splice(index, 1);
    };

    StepDefinitionModel.prototype.addMock = function (name) {
        var mockData = _.find(this.availableMockData, function (mockData) {
            return mockData.name === name;
        });
        if (mockData && !_.contains(this.mockData, mockData)) {
            this.mockData.push(mockData);
            this.mockDataInstances.push(new MockDataInstanceModel(mockData, this));
        } else {
            this.notifierService.error("MockData " + name + " doesnot exists");
        }
        this.mockDataName = '';
    };

    StepDefinitionModel.prototype.removeMock = function (toRemove) {
        var index = _.indexOf(this.mockDataInstances, toRemove);
        _.remove(this.mockDataInstances, function (mockDataInstance) {
            return mockDataInstance === toRemove;
        });
        this.mockData.splice(index, 1);
    };

    return StepDefinitionModel;

    function toAST () {
        var ast = astCreatorService;

        var components = this.componentInstances.map(function (component) {
            return component.ast;
        });

        var mockData = this.mockDataInstances.map(function (mockData) {
            return mockData.ast;
        });

        var template = 'module.exports = function () { ';
        if (components.length) {
            template += '%= components %; ';
        }
        if (mockData.length) {
            template += '%= mockData %; ';
        }
        template += '%= step %; ';
        template += '};';

        return ast.file(ast.expression(template, {
            components: components,
            mockData: mockData,
            step: this.step.ast
        }), this.meta);
    };
};

StepDefinitionEditor.factory('StepDefinitionModel', function (
    astCreatorService,
    ComponentFileService,
    MockDataFileService,
    ComponentInstanceModel,
    MockDataInstanceModel,
    notifierService
) {
    return createStepDefinitionModelConstructor(astCreatorService, ComponentFileService, MockDataFileService, ComponentInstanceModel, MockDataInstanceModel, notifierService);
});
