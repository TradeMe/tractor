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
    /*runs a single feature*/
    controller.runFeature = function(toRun){
        var environment = runnerService.getSelectedUrl();
        runnerService.runProtractor({
            baseUrl: environment,
            feature: toRun
        });
    }
    
    return controller;
};

FeatureEditor.controller('FeatureEditorController', FeatureEditorController);
