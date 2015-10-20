'use strict';

// Module:
var ComponentEditor = require('./ComponentEditor');

// Dependencies:
var FileEditorController = require('../FileEditor/FileEditorController');
require('../../Core/Services/PersistentStateService');
require('../../Core/Components/Notifier/NotifierService');
require('./Services/ComponentFileService');
require('./Models/ComponentModel');

var ComponentEditorController = function ComponentEditorController (
    $scope,
    $window,
    $state,
    persistentStateService,
    notifierService,
    ComponentFileService,
    ComponentModel,
    componentFileStructure,
    componentPath
) {
    var controller = new FileEditorController(
        $scope,
        $window,
        $state,
        persistentStateService,
        notifierService,
        ComponentFileService,
        ComponentModel,
        componentFileStructure,
        componentPath
    );
    controller.component = controller.fileModel;
    return controller;
};

ComponentEditor.controller('ComponentEditorController', ComponentEditorController);
