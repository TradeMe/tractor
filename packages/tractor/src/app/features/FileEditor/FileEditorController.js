'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

var FileEditorController = (function () {
    var FileEditorController = function FileEditorController (
        $scope,
        $window,
        NotifierService,
        FileService,
        FileModel,
        fileStructure,
        filePath,
        components,
        mockData
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;
        this.fileService = FileService;
        this.fileStructure = fileStructure;

        this.components = components;
        this.mockData = mockData;

        if (filePath) {
            this.fileModel = this.fileService.openFile(this.fileStructure, filePath.path, this.components, this.mockData);
        }
        if (FileModel) {
            this.fileModel = this.fileModel || new FileModel();
        }
    };

    FileEditorController.prototype.saveFile = function () {
        var path = null;

        this.fileService.getPath({
            name: this.fileModel.name,
            path: this.fileModel.path
        })
        .then(function (filePath) {
            path = filePath.path;
            var exists = this.fileService.checkFileExists(this.fileStructure, path);

            if (!exists || this.$window.confirm('This will overwrite "' + this.fileModel.name + '". Continue?')) {
                return this.fileService.saveFile({
                    data: this.fileModel.data,
                    path: path
                });
            } else {
                return Promise.reject();
            }
        }.bind(this))
        .then(function () {
            return this.fileService.getFileStructure();
        }.bind(this))
        .then(function (fileStructure) {
            this.fileStructure = fileStructure;
            this.fileModel = this.fileService.openFile(this.fileStructure, path, this.components, this.mockData);
        }.bind(this))
        .catch(function () {
            this.notifierService.error('File was not saved.');
        }.bind(this));
    };

    FileEditorController.prototype.showErrors = function () {
        var fileEditor = this.$scope['file-editor'];
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

    return FileEditorController;
})();

module.exports = FileEditorController;
