'use strict';

// Module:
var MockDataEditor = require('./MockDataEditor');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Services/ConfirmDialogService');
require('../../Core/Services/PersistentStateService');
require('../../Core/Components/Notifier/NotifierService');
require('./Models/MockDataModel');

var MockDataEditorController = function MockDataEditorController (
    $scope,
    $window,
    $state,
    confirmDialogService,
    fileStructureService,
    persistentStateService,
    notifierService,
    MockDataModel,
    mockData
) {
    return new FileEditorController(
        $scope,
        $window,
        $state,
        confirmDialogService,
        fileStructureService,
        persistentStateService,
        notifierService,
        MockDataModel,
        mockData,
        'mock-data',
        '.mock.json'
    );
};

MockDataEditor.controller('MockDataEditorController', MockDataEditorController);
