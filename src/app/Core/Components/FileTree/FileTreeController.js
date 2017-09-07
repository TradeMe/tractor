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
        $scope,
        $state,
        $interval,
        $window,
        notifierService,
        persistentStateService
    ) {
        this.$state = $state;
        this.$interval = $interval;
        this.$window = $window;
        this.notifierService = notifierService;
        this.persistentStateService = persistentStateService;

        this.moveItem = this.moveItem.bind(this);

        $scope.$watch(function () {
            return this.type;
        }.bind(this), function () {
            this.headerName = title(this.type.replace(/s$/, ''));
            this.canModify = this.type !== 'step-definitions';
        }.bind(this));

        $scope.$watch(function () {
            return this.fileStructure;
        }.bind(this), function () {
            this.fileStructure = updateFileStructure.call(this);
        }.bind(this));
    };

    FileTreeController.prototype.addDirectory = function (directory) {
        var newDirectoryUrl = path.join(directory.url, NEW_DIRECTORY_NAME);
        this.create(newDirectoryUrl);
    };

    FileTreeController.prototype.openItem = function (file) {
        this.$state.go('tractor.' + this.type, { file: { url: file.url } });
    };

    FileTreeController.prototype.copyItem = function (item) {
        this.move(item.url, {
            copy: true
        });
    };

    FileTreeController.prototype.deleteItem = function (item) {
        this.hideOptions(item);

        var hasChildren = item.files && item.files.length || item.directories && item.directories.length;

        if (!hasChildren || this.$window.confirm('All directory contents will be deleted as well. Continue?')){
            this.delete(item.url, {
                rimraf: true
            });
        }
    };

    FileTreeController.prototype.moveItem = function (file, directory) {
        var oldDirectoryUrl = getDirname(file.url);
        if (oldDirectoryUrl !== directory.url) {
            if (directory.url !== '/') {
                directory.url += '/';
            }
            this.move(file.url, {
                newUrl: file.url.replace(oldDirectoryUrl, directory.url)
            });
        }
    };

    FileTreeController.prototype.editName = function (item) {
        if (this.canModify || item.isDirectory) {
            item.editingName = true;
            item.previousName = item.basename;
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
        if (_.contains(item.basename, '_')) {
            this.notifierService.error('Invalid character: "_"');
            valid = false;
        }
        if (_.contains(item.basename, '/')) {
            this.notifierService.error('Invalid character: "/"');
            valid = false;
        }
        if (_.contains(item.basename, '\\')) {
            this.notifierService.error('Invalid character: "\\"');
            valid = false;
        }
        if (!item.basename.trim().length) {
            valid = false;
        }

        if (!valid) {
            item.basename = item.previousName;
        }

        if (item.basename !== item.previousName) {
            var oldName = item.previousName;
            var newName = item.basename;

            this.move(item.url, {
                newUrl: item.url.replace(oldName, newName)
            });
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
        var fileStructure = this.fileStructure;
        if (!fileStructure) {
            return null;
        }

        var openDirectories = getOpenDirectories.call(this);
        fileStructure = restoreOpenDirectories(fileStructure, openDirectories);
        fileStructure.open = true;

        fileStructure = filterByExtension(fileStructure, this.extension);
        return fileStructure;
    }

    return FileTreeController;
})();

Core.controller('FileTreeController', FileTreeController);
