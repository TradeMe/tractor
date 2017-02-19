'use strict';

// Module:
var FeatureEditor = require('./FeatureEditor');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Services/ConfirmDialogService');
require('../../Core/Services/PersistentStateService');
require('../../Core/Components/Notifier/NotifierService');
require('../ControlPanel/Services/RunnerService');
require('./Models/FeatureModel');

var FeatureEditorController = function FeatureEditorController (
    $scope,
    $window,
    $state,
    confirmDialogService,
    fileStructureService,
    persistentStateService,
    notifierService,
    runnerService,
    availableStepDefinitions,
    FeatureModel,
    feature,
    StepModel
) {
    var controller = new FileEditorController(
        $scope,
        $window,
        $state,
        confirmDialogService,
        fileStructureService,
        persistentStateService,
        notifierService,
        FeatureModel,
        feature,
        'features',
        '.feature'
    );

    this.availableStepDefinitions = availableStepDefinitions;
    this.runnerService = runnerService;

    this.controller = controller;
    controller.availableStepDefinitions = availableStepDefinitions;
    controller.debug = false;
    controller.findStep = findStep.bind(this);
    controller.runFeature = runFeature.bind(this);
    this.typeRegex = new RegExp('(' + StepModel.prototype.stepTypes.join('|') + ') ');

    return controller;
};

function findStep (stepDeclaration) {
    return this.availableStepDefinitions.find(function (stepDefinition) {
        return stepDefinition.meta.name.replace(this.typeRegex, '') === stepDeclaration.step;
    }.bind(this));
};

function runFeature (toRun) {
    if (toRun){
        this.runnerService.runProtractor({
            feature: toRun,
            debug: this.controller.debug
        });
    }
}

FeatureEditor.controller('FeatureEditorController', FeatureEditorController);
