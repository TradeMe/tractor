'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

var FileEditorController = (function () {
    var FileEditorController = function FileEditorController (
        $scope,
        $window,
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        FileService,
        FileModel,
        fileStructure,
        filePath
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.$state = $state;
        this.confirmDialogService = confirmDialogService;
        this.persistentStateService = persistentStateService;
        this.notifierService = notifierService;
        this.fileService = FileService;
        this.FileModel = FileModel;
        this.fileStructure = fileStructure;

        this.availableComponents = fileStructure.availableComponents;
        this.availableMockData = fileStructure.availableMockData;

        if (filePath) {
            this.fileService.openFile({ path: filePath.path }, this.availableComponents, this.availableMockData)
            .then(function (file) {
                this.fileModel = file;
                this.fileModel.references = getReferencesFiles(filePath.path, this.fileStructure.references);
            }.bind(this));
        } else if (FileModel && !this.fileModel) {
            this.newFile();
        }
    };

    FileEditorController.prototype.newFile = function () {
        if (this.fileModel) {
            this.$state.go('.', { file: null });
        }
        this.fileModel = new this.FileModel();
    };

    FileEditorController.prototype.saveFile = function () {
        var path = null;

        this.fileService.getPath({
            path: this.fileModel.path,
            name: this.fileModel.name
        })
        .then(function (filePath) {
            path = filePath.path;
            var exists = this.fileService.checkFileExists(this.fileStructure, path);

            if (exists) {
                this.confirmOverWrite = this.confirmDialogService.show();
                return this.confirmOverWrite.promise
                .finally(function () {
                    this.confirmOverWrite = null;
                }.bind(this));
            } else {
                return Promise.resolve();
            }
        }.bind(this))
        .then(function () {
            return this.fileService.saveFile({
                data: this.fileModel.data,
                path: path
            });
        }.bind(this))
        .then(function () {
            return this.fileService.getFileStructure();
        }.bind(this))
        .then(function (fileStructure) {
            this.fileStructure = fileStructure;
            this.fileService.openFile({ path: path }, this.availableComponents, this.availableMockData)
            .then(function (file) {
                this.fileModel = file;
                this.fileModel.references = getReferencesFiles(path, this.fileStructure.references);
            }.bind(this));
        }.bind(this))
        .catch(function () {
            this.notifierService.error('File was not saved.');
        }.bind(this));
    };

    FileEditorController.prototype.showErrors = function () {
        var fileEditor = this.fileEditor;
        if (fileEditor.$invalid) {
            _.each(Object.keys(fileEditor.$error), function (invalidType) {
                _.each(fileEditor.$error[invalidType], function (element) {
                    element.$setTouched();
                });
            });
            this.notifierService.error('Can\'t save file, something is invalid.');
        }
        return !fileEditor.$invalid;
    };

    FileEditorController.prototype.minimise = function (item) {
        item.minimised = !item.minimised;

        var displayState = this.persistentStateService.get(this.fileModel.name);
        displayState[item.name] = item.minimised;
        this.persistentStateService.set(this.fileModel.name, displayState);
    };

    //included relative stepDefinitions in references to components and mockData file model
    function getReferencesFiles(filePath,references){
        var referencesInstances = [];
        if (references && references[filePath]) {
            references[filePath].map(function(element){
                var referenceModel = {
                    name : element.substring(element.lastIndexOf('\\') + 1,element.indexOf('.')),
                    path : element
                };
                referencesInstances.push(referenceModel);
            });
        }
        return referencesInstances;
    }

    return FileEditorController;
})();

module.exports = FileEditorController;
