'use strict';

// Module:
var FeatureEditor = require('./FeatureEditor');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Services/ConfirmDialogService');
require('../../Core/Services/PersistentStateService');
require('../../Core/Components/Notifier/NotifierService');
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
    featurePath
) {
    return new FileEditorController(
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
};

FeatureEditor.controller('FeatureEditorController', FeatureEditorController);
