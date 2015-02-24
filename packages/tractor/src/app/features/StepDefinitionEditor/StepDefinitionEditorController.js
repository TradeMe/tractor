'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('./StepDefinitionEditor');

// Dependencies:
require('./Services/StepDefinitionFileService');
require('./Services/StepDefinitionParserService');

var StepDefinitionEditorController = (function () {
    var StepDefinitionEditorController = function StepDefinitionEditorController (
        StepDefinitionFileService,
        StepDefinitionParserService,
        stepDefinitionFileNames,
        components,
        mockData
    ) {
        this.stepDefinitionFileService = StepDefinitionFileService;
        this.stepDefinitionParserService = StepDefinitionParserService;

        this.stepDefinitionFileNames = stepDefinitionFileNames;
        this.availableComponents = components;
        this.availableMockData = mockData;

        Object.defineProperties(this, {
            canAddComponents: {
                get: function () {
                    return this.availableComponents.length > 0;
                }
            },
            canAddMockData: {
                get: function () {
                    return this.availableMockData.length > 0
                        && this.stepDefinition.step.type === 'Given';
                }
            },
            hasComponents: {
                get: function () {
                    return this.stepDefinition
                        && this.stepDefinition.componentInstances
                        && this.stepDefinition.componentInstances.length > 0;
                }
            },
            hasMockData: {
                get: function () {
                    return this.stepDefinition
                        && this.stepDefinition.mockDataInstances
                        && this.stepDefinition.mockDataInstances.length > 0;
                }
            },
            showTasksSection: {
                get: function () {
                    return this.hasComponents
                        && this.stepDefinition.step.type !== 'Then';
                }
            },
            showExpectationsSection: {
                get: function () {
                    return this.hasComponents
                        && this.stepDefinition.step.type === 'Then';
                }
            },
            showMockDataSection: {
                get: function () {
                    return this.hasComponents
                        && this.hasMockData
                        && this.stepDefinition.step.type === 'Given';
                }
            }
        });
    };

    StepDefinitionEditorController.prototype.openStepDefinitionFile = function (filename) {
        this.stepDefinitionFileService.openStepDefinitionFile(filename)
        .then(_.bind(function (data) {
            try {
                this.stepDefinition = this.stepDefinitionParserService.parse(data.ast, filename, this.availableComponents, this.availableMockData);
            } catch (e) { }
        }, this));
    };

    StepDefinitionEditorController.prototype.saveStepDefinitionFile = function () {
        this.stepDefinitionFileService.saveStepDefinitionFile(this.stepDefinition.ast, this.stepDefinition.name);
    };

    return StepDefinitionEditorController;
})();

StepDefinitionEditor.controller('StepDefinitionEditorController', StepDefinitionEditorController);
