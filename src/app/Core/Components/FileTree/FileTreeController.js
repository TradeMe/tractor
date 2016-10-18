'use strict';

// Constants:
var NEW_DIRECTORY_NAME = 'New directory';
var OPEN_DIRECTORIES = 'OpenDirectories';

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
        fileStructureService,
        notifierService,
        persistentStateService
    ) {
        this.$state = $state;
        this.$interval = $interval;
        this.$window = $window;
        this.notifierService = notifierService;
        this.fileStructureService = fileStructureService;
        this.persistentStateService = persistentStateService;

        this.headerName = title(this.type);
        this.canModify = this.type !== 'step-definitions';

        this.editFilePath = this.editFilePath.bind(this);

        this.fileStructureService.getFileStructure(this.extension);

        Object.defineProperty(this, 'fileStructure', {
            get: function () {
                return updateFileStructure.call(this);
            }
        });
    };

    FileTreeController.prototype.addDirectory = function (directory) {
        var newDirectoryUrl = path.join(directory.url, NEW_DIRECTORY_NAME);
        this.fileStructureService.saveItem(newDirectoryUrl)
        .then(updateFileStructure.bind(this));
    };

    FileTreeController.prototype.openItem = function (file) {
        this.$state.go('tractor.' + this.type, { file: { url: file.url } });
    };

    FileTreeController.prototype.copy = function (item) {
        this.fileStructureService.copyItem(item.url)
        .then(updateFileStructure.bind(this));
    };

    FileTreeController.prototype.delete = function (item) {
        this.hideOptions(item);

        var hasChildren = item.files && item.files.length || item.directories && item.directories.length;

        if (!hasChildren || this.$window.confirm('All directory contents will be deleted as well. Continue?')){
            this.fileStructureService.deleteItem(item.url, {
                rimraf: true
            })
            .then(updateFileStructure.bind(this));
        }
    };

    FileTreeController.prototype.editFilePath = function (file, directory) {
        var oldDirectoryPath = getDirname(file.path);
        if (oldDirectoryPath !== directory.path) {
            this.fileStructureService.editFilePath(this.type, {
                oldDirectoryPath: oldDirectoryPath,
                newDirectoryPath: directory.path,
                name: file.name
            })
            .then(updateFileStructure.bind(this));
        }
    };

    FileTreeController.prototype.editName = function (item) {
        if (this.canModify || item.isDirectory) {
            item.editingName = true;
            item.previousName = item.name;
            this.hideOptions(item);
        }
    };

    FileTreeController.prototype.hideOptions = function (item) {
        item.showOptions = false;
    };

    FileTreeController.prototype.renameOnEnter = function ($event, item) {
        if ($event.keyCode === 13) {
            this.saveNewName(item);
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
                .then(updateFileStructure.bind(this));
            } else {
                this.fileStructureService.editFilePath(this.type, {
                    directoryPath: oldDirectoryPath,
                    oldName: oldName,
                    newName: newName
                })
                .then(updateFileStructure.bind(this));
            }
        }
    };

    FileTreeController.prototype.showOptions = function (item) {
        item.showOptions = true;
    };

    FileTreeController.prototype.toggleOpenDirectory = function (item) {
        item.open = !item.open;
        var openDirectories = getOpenDirectories.call(this);
        if (openDirectories[item.path]) {
            delete openDirectories[item.path];
        } else {
            openDirectories[item.path] = true;
        }
        this.persistentStateService.set(OPEN_DIRECTORIES, openDirectories);
    };

    function filterByExtension (directory, extension) {
        directory.allFiles = directory.allFiles
        .filter(function (file) {
            return file.path.endsWith(extension);
        }.bind(this));
        directory.files = directory.files
        .filter(function (file) {
            return file.path.endsWith(extension);
        }.bind(this));

        directory.directories = directory.directories
        .map(function (directory) {
            return filterByExtension(directory, extension);
        }.bind(this));

        return directory;
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

    function getOpenDirectories () {
        return this.persistentStateService.get(OPEN_DIRECTORIES);
    }

    function restoreOpenDirectories (directory, openDirectories) {
        directory.directories.forEach(function (directory) {
            restoreOpenDirectories(directory, openDirectories);
        });
        directory.open = !!openDirectories[directory.path];
        return directory;
    }

    function updateFileStructure () {
        var fileStructure = this.fileStructureService.fileStructure;
        if (!fileStructure) {
            return null;
        }

        fileStructure = fileStructure.directories.find(function (directory) {
            return directory.name === this.type;
        }.bind(this));

        var openDirectories = getOpenDirectories.call(this);
        fileStructure = restoreOpenDirectories(fileStructure, openDirectories);
        fileStructure.open = true;

        fileStructure = filterByExtension(fileStructure, this.extension);
        return fileStructure;
    }

    return FileTreeController;
})();

Core.controller('FileTreeController', FileTreeController);
