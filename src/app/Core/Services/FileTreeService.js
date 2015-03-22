'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

var FileTreeService = function FileTreeService (
    $http
) {
    var STARTS_WITH_DOT = /^\./;
    var FILE_NAME = /(.*?)\./;
    var FILE_EXTENSION = /(\..*)/;

    return {
        addDirectory: addDirectory,
        editName: editName,
        organiseFolderStructure: organiseFolderStructure
    };

    function addDirectory (options) {
        return $http.post('/add-directory', options);
    }

    function editName (options) {
        return $http.post('/edit-name', options);
    }

    function moveFile (options) {
        return $http.post('/move-file', options);
    }

    function organiseFolderStructure (directory) {
        var skip = ['name', '-name', 'path', '-path', '-type'];
        _.each(directory, function (info, name) {
            var type = info['-type'];
            var path = info['-path'];
            if (type === 'd') {
                // Directory:
                info.name = name;
                info.path = path;
                directory.directories = directory.directories || [];
                directory.directories.push(organiseFolderStructure(info));
            } else if (!_.contains(skip, name)) {
                // File:
                // Skip hidden files (starting with ".")...
                if (!STARTS_WITH_DOT.test(name)) {
                    directory.files = directory.files || [];
                    directory.files.push({
                        name: _.last(FILE_NAME.exec(name)),
                        extension: _.last(FILE_EXTENSION.exec(name)),
                        path: path
                    });
                }
            }
        });
        directory.path = directory['-path'];
        return directory;
    }
};

Core.service('FileTreeService', FileTreeService);
