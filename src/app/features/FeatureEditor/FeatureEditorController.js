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
    FeatureModel,
    feature,
    runnerService
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

    this.runnerService = runnerService;
    controller.runFeature = runFeature.bind(this);
    return controller;
};

function runFeature (toRun) {
    if (toRun){
        this.runnerService.runProtractor({
            feature: toRun
        });
    }
}

FeatureEditor.controller('FeatureEditorController', FeatureEditorController);
