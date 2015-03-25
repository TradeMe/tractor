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
        deleteFile: deleteFile,
        editName: editName,
        getExpanded: getExpanded,
        setExpanded: setExpanded,
        moveFile: moveFile
    };

    function getFileStructure (options) {
        return $http.get('/get-file-structure', {
            params: options
        })
        .then(updateFileStructure);
    }

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
        fileStructure = restoreExpanded(fileStructure);
        fileStructure.expanded = true;
        return fileStructure;
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
