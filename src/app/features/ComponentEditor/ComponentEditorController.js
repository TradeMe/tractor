'use strict';

// Module:
var ComponentEditor = require('./ComponentEditor');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Services/ConfirmDialogService');
require('../../Core/Services/PersistentStateService');
require('../../Core/Components/Notifier/NotifierService');
require('./Models/ComponentModel');

var ComponentEditorController = function ComponentEditorController (
    $scope,
    $window,
    $state,
    confirmDialogService,
    fileStructureService,
    persistentStateService,
    notifierService,
    ComponentModel,
    component
) {
    var controller = new FileEditorController(
        $scope,
        $window,
        $state,
        confirmDialogService,
        fileStructureService,
        persistentStateService,
        notifierService,
        ComponentModel,
        component,
        'components',
        '.component.js'
    );
    controller.component = controller.fileModel;
    return controller;
};

ComponentEditor.controller('ComponentEditorController', ComponentEditorController);
