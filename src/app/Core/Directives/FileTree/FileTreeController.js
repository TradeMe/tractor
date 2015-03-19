'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../../Core');

var FileTreeController = (function () {
    var FileTreeController = function FileTreeController () {
        organiseFolderStructure.call(this);
    };

    function organiseFolderStructure (directory) {
        directory = directory || this.model.folderStructure;
        var path = directory['-path'];
        _.each(directory, function (info, name) {
            // Directory:
            var type = info['-type'];
            var path = info['-path'];
            if (type === 'd') {
                info.name = name;
                info.path = path;
                return organiseFolderStructure.call(this, info);
            // File:
            } else if (name !== '-type' && name !== '-path') {
                directory.files = directory.files || [];
                directory.files.push({
                    name: name,
                    path: path
                });
            }
            delete directory[name];
            delete info['-type'];
            delete info['-path'];
        });
        directory.path = path;
        delete directory['-type'];
        delete directory['-path'];
    }

    return FileTreeController;
})();

Core.controller('FileTreeController', FileTreeController);
