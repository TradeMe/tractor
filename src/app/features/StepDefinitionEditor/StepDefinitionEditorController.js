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
        $stateParams,
        StepDefinitionFileService,
        StepDefinitionParserService,
        stepDefinitionFileNames,
        stepDefinitionFile,
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
                    return this.availableComponents.length > 0
                        && this.stepDefinition.step.type !== 'Given';
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
                        && this.stepDefinition.step.type === 'When';
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
                    return this.stepDefinition.step.type === 'Given';
                }
            }
        });

        if (stepDefinitionFile) {
            parseStepDefinitionFile.call(this, $stateParams.stepDefinition, stepDefinitionFile);
        }
    };

    StepDefinitionEditorController.prototype.saveStepDefinitionFile = function () {
        this.stepDefinitionFileService.saveStepDefinitionFile(this.stepDefinition.ast, this.stepDefinition.name);
    };

    function parseStepDefinitionFile (filename, stepDefinitionFile) {
        try {
            this.stepDefinition = this.stepDefinitionParserService.parse(stepDefinitionFile.ast, filename, this.availableComponents, this.availableMockData);
        } catch (e) { }
    }

    return StepDefinitionEditorController;
})();

StepDefinitionEditor.controller('StepDefinitionEditorController', StepDefinitionEditorController);
