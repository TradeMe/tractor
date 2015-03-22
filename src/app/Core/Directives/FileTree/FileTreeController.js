'use strict';

// Module:
var Core = require('../../Core');

// Dependencies:
var changecase = require('change-case');
var pascal = changecase.pascal;
var title = changecase.title;
require('../../Services/FileTreeService');

var transforms = {
    '.component.js': function (oldName, newName) {
        return {
            replace: pascal(oldName),
            with: pascal(newName)
        }
    }
};

var FileTreeController = (function () {
    var FileTreeController = function FileTreeController (
        $state,
        $timeout,
        FileTreeService
    ) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.fileTreeService = FileTreeService;

        this.headerName = title(this.type);
        this.folderStructure = this.fileTreeService.organiseFolderStructure(this.model.folderStructure);
    };

    FileTreeController.prototype.addDirectory = function (directory) {
        this.fileTreeService.addDirectory({
            root: this.folderStructure.path,
            path: directory.path
        })
        .then(function (folderStructure) {
            this.folderStructure = this.fileTreeService.organiseFolderStructure(folderStructure);
        }.bind(this));
    };

    FileTreeController.prototype.startEditingName = function (item) {
        item.editingName = true;
        item.previousName = item.name;
    };

    FileTreeController.prototype.editName = function (item) {
        item.editingName = false;
        if (!item.name.trim().length) {
            item.name = item.previousName;
        }
        if (item.name !== item.previousName) {
            var oldName = item.previousName;
            var newName = item.name;
            var extension = item.extension || '';
            var transform = transforms[item.extension];
            if (transform) {
                transform = transform(oldName, newName);
            }

            this.fileTreeService.editName({
                root: this.folderStructure.path,
                path: item.path,
                oldName: oldName + extension,
                newName: newName + extension,
                transform: transform
            })
            .then(function (folderStructure) {
                this.folderStructure = this.fileTreeService.organiseFolderStructure(folderStructure);
            }.bind(this));
        }
    };

    FileTreeController.prototype.renameOnEnter = function ($event, item) {
        if ($event.keyCode === 13) {
            this.editName(item);
        }
    };

    FileTreeController.prototype.openFile = function (item) {
        this.$timeout(function () {
            if (!item.editingName) {
                var params = {};
                params[this.type] = item.name;
                this.$state.go('tractor.' + this.type + '-editor', params)
            }
        }.bind(this), 200);
    }

    FileTreeController.prototype.moveFile = function (root, file, directory) {
        debugger;
    }

    return FileTreeController;
})();

Core.controller('FileTreeController', FileTreeController);
