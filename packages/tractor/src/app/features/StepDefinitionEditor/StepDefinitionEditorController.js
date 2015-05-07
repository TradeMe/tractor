'use strict';

// Module:
var StepDefinitionEditor = require('./StepDefinitionEditor');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Components/Notifier/NotifierService');
require('./Services/StepDefinitionFileService');

var StepDefinitionEditorController = function StepDefinitionEditorController (
    $scope,
    $window,
    NotifierService,
    StepDefinitionFileService,
    stepDefinitionFileStructure,
    stepDefinitionPath,
    components,
    mockData
) {
    var controller = new FileEditorController(
        $scope,
        $window,
        NotifierService,
        StepDefinitionFileService,
        null,
        stepDefinitionFileStructure,
        stepDefinitionPath,
        components,
        mockData
    );
    controller.availableComponents = components;
    controller.availableMockData = mockData;

    Object.defineProperties(controller, {
        canAddComponents: {
            get: function () {
                return this.availableComponents.length > 0
                    && this.fileModel.step.type !== 'Given';
            }
        },
        canAddMockData: {
            get: function () {
                return this.availableMockData.length > 0
                    && this.fileModel.step.type === 'Given';
            }
        },
        hasComponents: {
            get: function () {
                return this.fileModel
                    && this.fileModel.componentInstances
                    && this.fileModel.componentInstances.length > 0;
            }
        },
        hasMockData: {
            get: function () {
                return this.fileModel
                    && this.fileModel.mockDataInstances
                    && this.fileModel.mockDataInstances.length > 0;
            }
        },
        showTasksSection: {
            get: function () {
                return this.hasComponents
                    && this.fileModel.step.type === 'When';
            }
        },
        showExpectationsSection: {
            get: function () {
                return this.hasComponents
                    && this.fileModel.step.type === 'Then';
            }
        },
        showMockDataSection: {
            get: function () {
                return this.fileModel.step.type === 'Given';
            }
        }
    });

    return controller;
};

StepDefinitionEditor.controller('StepDefinitionEditorController', StepDefinitionEditorController);
