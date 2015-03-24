'use strict';

// Utilities:
var path = require('path');

// Module:
var Core = require('../../Core');

// Dependencies:
var changecase = require('change-case');
var pascal = changecase.pascal;
var title = changecase.title;
require('../../Services/FileStructureService');

var createTransform = {
    '.component.js': function (oldName, newName) {
        var nonalphaquote = '([^a-zA-Z0-9\"])';
        return [{
            replace: nonalphaquote + pascal(oldName) + nonalphaquote,
            with: '$1' + pascal(newName) + '$2'
        }, {
            replace: '\"' + oldName + '\"',
            with: '"' + newName + '"'
        }]
    },
    '.feature': function (oldName, newName) {
        return [{
            replace: '(\\s)' + oldName + '(\\r\\n|\\n)',
            with: '$1' + newName + '$2'
        }];
    }
};

var FileTreeController = (function () {
    var FileTreeController = function FileTreeController (
        $state,
        $timeout,
        FileStructureService
    ) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.fileStructureService = FileStructureService;

        this.headerName = title(this.type);
        this.fileStructure = this.fileStructureService.organiseFileStructure(this.model.fileStructure);
        this.fileStructure.expanded = true;

        this.moveFile = this.moveFile.bind(this);
    };

    FileTreeController.prototype.addDirectory = function (directory) {
        this.fileStructureService.addDirectory({
            root: this.fileStructure.path,
            path: directory.path
        })
        .then(function (fileStructure) {
            this.fileStructure = fileStructure
        }.bind(this));
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
            var extension = item.extension || '';
            var create = createTransform[item.extension];
            var transforms;
            if (create) {
                transforms = create(oldName, newName);
            }

            this.fileStructureService.editName({
                root: this.fileStructure.path,
                path: item.path,
                oldName: oldName + extension,
                newName: newName + extension,
                transforms: transforms
            })
            .then(function (fileStructure) {
                this.fileStructure = fileStructure
            }.bind(this));
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
                var directoryPath = this.fileStructure.path.replace(/\\/g, '/');
                var filePath = item.path.replace(/\\/g, '/');
                params[this.type] = path.relative(directoryPath, filePath);
                this.$state.go('tractor.' + this.type + '-editor', params)
            }
        }.bind(this), 200);
    };

    FileTreeController.prototype.moveFile = function (root, file, directory) {
        this.fileStructureService.moveFile({
            root: root,
            fileName: file.name + file.extension,
            filePath: file.path,
            directoryPath: directory.path
        })
        .then(function (fileStructure) {
            this.fileStructure = fileStructure
        }.bind(this));
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
        if ((item.files && item.files.length) || (item.directories && item.directories.length)) {
            alert('Cannot delete a directory with files in it.');
        } else {
            var extension = item.extension || '';
            this.fileStructureService.deleteFile({
                root: this.fileStructure.path,
                path: item.path,
                name: item.name + extension
            })
            .then(function (fileStructure) {
                this.fileStructure = fileStructure
            }.bind(this));
        }
    };

    return FileTreeController;
})();

Core.controller('FileTreeController', FileTreeController);
