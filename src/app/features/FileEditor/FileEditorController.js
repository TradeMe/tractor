'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');
var Promise = require('bluebird');

var FileEditorController = (function () {
    var FileEditorController = function FileEditorController (
        $scope,
        $window,
        $state,
        confirmDialogService,
        fileStructureService,
        persistentStateService,
        notifierService,
        FileModel,
        file,
        type,
        extension
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.$state = $state;
        this.confirmDialogService = confirmDialogService;
        this.fileStructureService = fileStructureService,
        this.persistentStateService = persistentStateService;
        this.notifierService = notifierService;
        this.FileModel = FileModel;
        this.type = type;
        this.extension = extension;

        if (file) {
            this.fileModel = file;
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
        var fileStructure = this.fileStructureService.fileStructure;
        var fileUrl = this.fileModel.url || path.join(fileStructure.url, this.type, this.fileModel.name + this.extension);

        var exists = this.fileStructureService.checkFileExists(fileStructure, fileUrl);

        var confirm = Promise.resolve();
        if (exists) {
            this.confirmOverWrite = this.confirmDialogService.show();
            confirm = this.confirmOverWrite.promise
            .finally(function () {
                this.confirmOverWrite = null;
            }.bind(this));
        }

        confirm.then(function () {
            return this.fileStructureService.saveItem(fileUrl, {
                data: this.fileModel.data,
                overwrite: exists
            });
        }.bind(this))
        .then(function () {
            this.$state.go('.', {
                file: {
                    url: fileUrl
                }
            });
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

    return FileEditorController;
})();

module.exports = FileEditorController;
