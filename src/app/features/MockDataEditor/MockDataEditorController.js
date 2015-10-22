'use strict';

// Module:
var MockDataEditor = require('./MockDataEditor');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Services/ConfirmDialogService');
require('../../Core/Services/PersistentStateService');
require('../../Core/Components/Notifier/NotifierService');
require('./Services/MockDataFileService');
require('./Models/MockDataModel');

var MockDataEditorController = function MockDataEditorController (
    $scope,
    $window,
    $state,
    confirmDialogService,
    persistentStateService,
    notifierService,
    MockDataFileService,
    MockDataModel,
    mockDataFileStructure,
    mockDataPath
) {
    return new FileEditorController(
        $scope,
        $window,
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        MockDataFileService,
        MockDataModel,
        mockDataFileStructure,
        mockDataPath
    );
};

MockDataEditor.controller('MockDataEditorController', MockDataEditorController);
