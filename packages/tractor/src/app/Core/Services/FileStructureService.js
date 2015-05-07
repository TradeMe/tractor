'use strict';

// Module:
var Core = require('../Core');

var FileStructureService = function FileStructureService (
    $http,
    localStorageService
) {
    var EXPANDED_STORAGE_KEY = 'FileTreeExpanded';

    return {
        getFileStructure: getFileStructure,
        addDirectory: addDirectory,
        copyFile: copyFile,
        deleteDirectory: deleteDirectory,
        deleteFile: deleteFile,
        editDirectoryPath: editDirectoryPath,
        editFilePath: editFilePath,
        getExpanded: getExpanded,
        setExpanded: setExpanded
    };

    function getFileStructure (options) {
        return $http.get('/file-structure', {
            params: options
        })
        .then(updateFileStructure);
    }

    function addDirectory (type, options) {
        return $http.post('/' + type + '/directory', options)
        .then(updateFileStructure);
    }

    function copyFile (type, options) {
        return $http.post('/' + type + '/file/copy', options)
        .then(updateFileStructure);
    }

    function deleteDirectory (type, options) {
        options.isDirectory = true;
        return $http.delete('/' + type + '/directory', {
            params: options
        })
        .then(updateFileStructure);
    }

    function deleteFile (type, options) {
        return $http.delete('/' + type + '/file', {
            params: options
        })
        .then(updateFileStructure);
    }

    function editDirectoryPath (type, options) {
        options.isDirectory = true;
        return $http.patch('/' + type + '/directory/path', options)
        .then(updateFileStructure);
    }

    function editFilePath (type, options) {
        return $http.patch('/' + type + '/file/path', options)
        .then(updateFileStructure);
    }

    function updateFileStructure (fileStructure) {
        fileStructure = restoreExpanded(fileStructure);
        fileStructure.directories.forEach(function (topLevelDirectory) {
            topLevelDirectory.expanded = true;
        });
        return fileStructure;
    }

    function getExpanded () {
        return localStorageService.get(EXPANDED_STORAGE_KEY) || {};
    }

    function setExpanded (expanded) {
        localStorageService.set(EXPANDED_STORAGE_KEY, expanded);
    }

    function restoreExpanded (directory) {
        if (directory.directories) {
            directory.directories.forEach(function (directory) {
                restoreExpanded(directory);
            });
        }
        directory.expanded = !!getExpanded()[directory.path];
        return directory;
    }
};

Core.service('FileStructureService', FileStructureService);
