'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

var FileStructureService = function FileStructureService (
    $http,
    localStorageService
) {
    var STARTS_WITH_DOT = /^\./;
    var FILE_NAME = /(.*?)\./;
    var FILE_EXTENSION = /(\..*)/;

    var EXPANDED_STORAGE_KEY = 'FileTreeExpanded';

    return {
        addDirectory: addDirectory,
        deleteFile: deleteFile,
        editName: editName,
        getExpanded: getExpanded,
        setExpanded: setExpanded,
        moveFile: moveFile,
        organiseFileStructure: organiseFileStructure
    };

    function addDirectory (options) {
        return $http.post('/add-directory', options)
        .then(updateFileStructure);
    }

    function deleteFile (options) {
        return $http.post('/delete-file', options)
            .then(updateFileStructure);
    }

    function editName (options) {
        return $http.post('/edit-name', options)
        .then(updateFileStructure);
    }

    function getExpanded () {
        return localStorageService.get(EXPANDED_STORAGE_KEY) || {};
    }

    function setExpanded (expanded) {
        localStorageService.set(EXPANDED_STORAGE_KEY, expanded);
    }

    function moveFile (options) {
        return $http.post('/move-file', options)
        .then(updateFileStructure);
    }

    function updateFileStructure (fileStructure) {
        fileStructure = organiseFileStructure(fileStructure);
        fileStructure.expanded = true;
        return fileStructure;
    }

    function organiseFileStructure (directory) {
        var skip = ['name', '-name', 'path', '-path', '-type'];
        _.each(directory, function (item, name) {
            var type = item['-type'];
            var path = item['-path'];
            if (type === 'd') {
                // Directory:
                item.name = name;
                item.path = path;
                directory.directories = directory.directories || [];
                directory.directories.push(organiseFileStructure(item));
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
        directory.expanded = !!getExpanded()[directory.path];
        return directory;
    }
};

Core.service('FileStructureService', FileStructureService);
