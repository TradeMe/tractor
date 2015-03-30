'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');

// Module:
var Core = require('../../Core');

// Dependencies:
var title = require('change-case').title;
require('../../Services/FileStructureService');

var FileTreeController = (function () {
    var FileTreeController = function FileTreeController (
        $state,
        $timeout,
        $window,
        FileStructureService
    ) {
        debugger;
        this.$state = $state;
        this.$timeout = $timeout;
        this.$window = $window;
        this.fileStructureService = FileStructureService;

        this.headerName = title(this.type);

        this.moveFile = this.moveFile.bind(this);
    };

    FileTreeController.prototype.addDirectory = function (directory) {
        this.fileStructureService.addDirectory({
            path: directory.path
        })
        .then(setFileStructure.bind(this));
    };

    FileTreeController.prototype.editName = function (item) {
        item.editingName = true;
        item.previousName = item.name;
        this.hideOptions(item);
    };

    FileTreeController.prototype.saveNewName = function (item) {
        item.editingName = false;
        if (!item.name.trim().length) {
            item.name = item.previousName;
        }
        if (item.name !== item.previousName) {
            var oldName = item.previousName;
            var newName = item.name;

            // Sw33t hax()rz to get around the browserify "path" shim not working on Windows.
            var oldDirectoryPath = path.dirname(item.path.replace(/\\/g, '/'));
            this.fileStructureService.moveFile({
                directoryPath: oldDirectoryPath,
                oldName: oldName,
                newName: newName,
                isDirectory: !!item.isDirectory
            })
            .then(setFileStructure.bind(this));
        }
    };

    FileTreeController.prototype.renameOnEnter = function ($event, item) {
        if ($event.keyCode === 13) {
            this.saveNewName(item);
        }
    };

    FileTreeController.prototype.openFile = function (item) {
        this.$timeout(function () {
            if (!item.editingName) {
                var params = {};
                // Sw33t hax()rz to get around the browserify "path" shim not working on Windows.
                var directoryPath = this.model.fileStructure.path.replace(/\\/g, '/');
                var filePath = item.path.replace(/\\/g, '/');
                var relativePath = path.relative(directoryPath, filePath);
                params[this.type] = _.last(relativePath.match(/(.*?)\..*/));
                this.$state.go('tractor.' + this.type + '-editor', params);
            }
        }.bind(this), 200);
    };

    FileTreeController.prototype.moveFile = function (file, directory) {
        // Sw33t hax()rz to get around the browserify "path" shim not working on Windows.
        var oldDirectoryPath = path.dirname(file.path.replace(/\\/g, '/'));
        if (oldDirectoryPath !== directory.path) {
            this.fileStructureService.moveFile({
                oldDirectoryPath: oldDirectoryPath,
                newDirectoryPath: directory.path,
                name: file.name,
                isDirectory: false
            })
            .then(setFileStructure.bind(this));
        }
    };

    FileTreeController.prototype.expandDirectory = function (item) {
        this.$timeout(function () {
            if (!item.editingName) {
                item.expanded = !item.expanded;
                var expanded = this.fileStructureService.getExpanded();
                if (item.expanded) {
                    expanded[item.path] = item.expanded;
                } else {
                    delete expanded[item.path];
                }
                this.fileStructureService.setExpanded(expanded);
            }
        }.bind(this), 200);
    };

    FileTreeController.prototype.showOptions = function (item) {
        item.showOptions = true;
    };

    FileTreeController.prototype.hideOptions = function (item) {
        item.showOptions = false;
    };

    FileTreeController.prototype.delete = function (item) {
        this.hideOptions(item);
        if (item.files && item.files.length || item.directories && item.directories.length) {
            this.$window.alert('Cannot delete a directory with files in it.');
        } else {
            this.fileStructureService.deleteFile({
                path: item.path,
                name: item.name,
                isDirectory: item.isDirectory
            })
            .then(setFileStructure.bind(this));
        }
    };

    var directoryNames = {
        'component': 'components',
        'feature': 'features',
        'step-definition': 'step_definitions',
        'mock-data': 'mock_data'
    };

    function setFileStructure (fileStructure) {
        debugger;
        var directory = _.find(fileStructure.directories, function (directory) {
            return directory.name = directoryNames[this.type];
        }.bind(type));
        this.model.fileStructure = directory;
    }

    return FileTreeController;
})();

Core.controller('FileTreeController', FileTreeController);
