'use strict';

// Module:
var FeatureEditor = require('./FeatureEditor');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Services/ConfirmDialogService');
require('../../Core/Services/PersistentStateService');
require('../../Core/Components/Notifier/NotifierService');
require('../ControlPanel/Services/RunnerService');
require('./Services/FeatureFileService');
require('./Models/FeatureModel');

var FeatureEditorController = function FeatureEditorController (
    $scope,
    $window,
    $state,
    confirmDialogService,
    persistentStateService,
    notifierService,
    FeatureFileService,
    FeatureModel,
    featureFileStructure,
    featurePath,
    runnerService
) {
    var controller = new FileEditorController(
        $scope,
        $window,
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        FeatureFileService,
        FeatureModel,
        featureFileStructure,
        featurePath
    );

    this.runnerService = runnerService;
    controller.debug = false;
    this.controller = controller;
    controller.runFeature = runFeature.bind(this);    
    return controller;
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
