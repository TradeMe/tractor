'use strict';

// Module:
var StepDefinitionEditor = require('./StepDefinitionEditor');

// Utilities:
var _ = require('lodash');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Services/ConfirmDialogService');
require('../../Core/Services/PersistentStateService');
require('../../Core/Components/Notifier/NotifierService');

var StepDefinitionEditorController = function StepDefinitionEditorController (
    $scope,
    $window,
    $state,
    confirmDialogService,
    fileStructureService,
    persistentStateService,
    notifierService,
    ComponentParserService,
    MockDataParserService,
    availableComponents,
    availableMockData,
    stepDefinition
) {
    var controller = new FileEditorController(
        $scope,
        $window,
        $state,
        confirmDialogService,
        fileStructureService,
        persistentStateService,
        notifierService,
        null,
        stepDefinition,
        'step-definitions',
        '.step.js'
    );

    Object.defineProperties(controller, {
        canAddComponents: {
            get: function () {
                return availableComponents.length > 0
                    && this.fileModel.step.type !== 'Given';
            }
        },
        canAddMockData: {
            get: function () {
                return availableMockData.length > 0
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
