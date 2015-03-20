'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../../Core');

// Dependencies:
var title = require('change-case').title;
require('../../Services/FileTreeService');

var FileTreeController = (function () {
    var FileTreeController = function FileTreeController (
        FileTreeService
    ) {
        this.fileTreeService = FileTreeService;

        this.folderStructure = organiseFolderStructure(this.model.folderStructure);
        this.headerName = title(this.type);
    };

    FileTreeController.prototype.addFolder = function (directory) {
        this.fileTreeService.editDirectory({
            path: directory.path
        })
        .then(function (folderStructure) {
            this.folderStructure = organiseFolderStructure(folderStructure);
            directory.showFolderNameInput = true;
        }.bind(this));
    };

    FileTreeController.prototype.editFolderName = function () {

    };

    function organiseFolderStructure (directory) {
        var skip = ['name', '-name', 'path', '-path', '-type'];
        _.each(directory, function (info, name) {
            var type = info['-type'];
            var path = info['-path'];
            // Directory:
            if (type === 'd') {
                info.name = name;
                info.path = path;
                directory.directories = directory.directories || [];
                directory.directories.push(organiseFolderStructure(info));
            // File:
            } else if (!_.contains(skip, name)) {
                directory.files = directory.files || [];
                directory.files.push({
                    name: _.last(/^(.*?)\./.exec(name)),
                    path: path
                });
            }
        });
        directory.path = directory['-path'];
        return directory;
    }

    return FileTreeController;
})();

Core.controller('FileTreeController', FileTreeController);
