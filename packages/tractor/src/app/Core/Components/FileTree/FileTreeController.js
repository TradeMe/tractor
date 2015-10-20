'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');

// Module:
var Core = require('../../Core');

// Dependencies:
var camel = require('change-case').camel;
var title = require('change-case').title;
require('../../Services/FileStructureService');

var FileTreeController = (function () {
    var FileTreeController = function FileTreeController (
        $state,
        $interval,
        $window,
        notifierService,
        fileStructureService
    ) {
        this.$state = $state;
        this.$interval = $interval;
        this.$window = $window;
        this.notifierService = notifierService;
        this.fileStructureService = fileStructureService;

        this.headerName = title(this.type);
        this.canModify = this.type !== 'step-definitions';

        this.editFilePath = this.editFilePath.bind(this);
    };

    FileTreeController.prototype.getName = function (item) {
        if (item.ast) {
            var metaComment = _.first(item.ast.comments);
            var meta = JSON.parse(metaComment.value);
            return meta.name;
        }
        return item.name;
    };

    FileTreeController.prototype.addDirectory = function (directory) {
        this.fileStructureService.addDirectory(this.type, {
            path: directory.path
        })
        .then(setFileStructure.bind(this));
    };

    FileTreeController.prototype.editName = function (item) {
        if (this.canModify || item.isDirectory) {
            item.editingName = true;
            item.previousName = item.name;
            this.hideOptions(item);
        }
    };

    FileTreeController.prototype.saveNewName = function (item) {
        item.editingName = false;

        var valid = true;
        if (_.contains(item.name, '_')) {
            this.notifierService.error('Invalid character: "_"');
            valid = false;
        }
        if (_.contains(item.name, '/')) {
            this.notifierService.error('Invalid character: "/"');
            valid = false;
        }
        if (_.contains(item.name, '\\')) {
            this.notifierService.error('Invalid character: "\\"');
            valid = false;
        }
        if (!item.name.trim().length) {
            valid = false;
        }

        if (!valid) {
            item.name = item.previousName;
        }

        if (item.name !== item.previousName) {
            var oldName = item.previousName;
            var newName = item.name;

            var oldDirectoryPath = getDirname(item.path);

            var isDirectory = !!item.isDirectory;
            if (isDirectory) {
                this.fileStructureService.editDirectoryPath(this.type, {
                    directoryPath: oldDirectoryPath,
                    oldName: oldName,
                    newName: newName
                })
                .then(setFileStructure.bind(this));
            } else {
                this.fileStructureService.editFilePath(this.type, {
                    directoryPath: oldDirectoryPath,
                    oldName: oldName,
                    newName: newName
                })
                .then(setFileStructure.bind(this));
            }
        }
    };

    FileTreeController.prototype.renameOnEnter = function ($event, item) {
        if ($event.keyCode === 13) {
            this.saveNewName(item);
        }
    };

    FileTreeController.prototype.openFile = function (file) {
        var filePath = file.path.replace(/\\/g, '/');
        var name = path.relative(this.model.fileStructure.directory.path, filePath);
        name = name.substring(0, name.indexOf('.'));
        var params = {
            file: {
                name: name
            }
        };
        this.$state.go('tractor.' + this.type, params);
    };

    FileTreeController.prototype.editFilePath = function (file, directory) {
        var oldDirectoryPath = getDirname(file.path);
        if (oldDirectoryPath !== directory.path) {
            this.fileStructureService.editFilePath(this.type, {
                oldDirectoryPath: oldDirectoryPath,
                newDirectoryPath: directory.path,
                name: file.name
            })
            .then(setFileStructure.bind(this));
        }
    };

    FileTreeController.prototype.toggleOpenDirectory = function (item) {
        item.open = !item.open;
        this.fileStructureService.toggleOpenDirectory(item.path);
    };

    FileTreeController.prototype.showOptions = function (item) {
        item.showOptions = true;
    };

    FileTreeController.prototype.hideOptions = function (item) {
        item.showOptions = false;
    };

    FileTreeController.prototype.delete = function (item) {
        this.hideOptions(item);

        var hasChildren = item.files && item.files.length || item.directories && item.directories.length;

        if (!hasChildren) { // || this.$window.confirm('All directory contents will be deleted as well. Continue?')){
            var deleteOptions = {
                path: item.path,
                name: item.name
            };
            if (item.isDirectory) {
                this.fileStructureService.deleteDirectory(this.type, deleteOptions)
                .then(setFileStructure.bind(this));
            } else {
                this.fileStructureService.deleteFile(this.type, deleteOptions)
                .then(setFileStructure.bind(this));
            }
        }
    };

    FileTreeController.prototype.copy = function (item) {
        this.fileStructureService.copyFile(this.type, {
            path: item.path
        })
        .then(setFileStructure.bind(this));
    };

    function setFileStructure (fileStructure) {
        this.model.fileStructure = fileStructure;
    }

    function getDirname (filePath) {
        // Sw33t hax()rz to get around the browserify "path" shim not working on Windows.
        var haxedFilePath = filePath.replace(/\\/g, '/');
        var dirname = path.dirname(haxedFilePath);
        if (haxedFilePath !== filePath) {
            dirname = dirname.replace(/\//g, '\\');
        }
        return dirname;
    }

    return FileTreeController;
})();

Core.controller('FileTreeController', FileTreeController);
