'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

var FileStructureService = function FileStructureService (
    $http
) {
    var _fileStructure = null;

    var service = {
        checkFileExists: checkFileExists,
        deleteItem: deleteItem,
        getFileStructure: getFileStructure,
        moveItem: moveItem,
        openItem: openItem,
        refactorItem: refactorItem,
        saveItem: saveItem
    };

    Object.defineProperty(service, 'fileStructure', {
        get: function () {
            return _fileStructure;
        }
    });

    return service;

    function checkFileExists (fileStructure, fileUrl) {
        return !!fileStructure.allFilesByUrl[fileUrl];
    }

    function deleteItem (itemUrl, options) {
        return $http.delete('/fs' + itemUrl, {
            params: options
        })
        .then(updateFileStructure.bind(this));
    }

    function getFileStructure () {
        return $http.get('/fs/')
        .then(updateFileStructure.bind(this));
    }

    function moveItem (itemUrl, options) {
        return $http.post('/fs/move' + itemUrl, options)
        .then(updateFileStructure.bind(this));
    }

    function openItem (itemUrl) {
        itemUrl = decodeURIComponent(itemUrl);
        return $http.get('/fs' + itemUrl);
    }

    function refactorItem (itemUrl, options) {
        debugger;
        return $http.post('/fs/refactor' + itemUrl, {
            update: options
        });
    }

    function saveItem (itemUrl, options) {
        return $http.put('/fs' + itemUrl, options)
        .then(updateFileStructure.bind(this));
    }

    function getAllFiles (directory) {
        if (directory.directories.length) {
            directory.directories.forEach(function (directory) {
                getAllFiles(directory);
            });
            directory.allFiles = Array.prototype.concat.apply([], directory.directories.map(function (directory) {
                return directory.allFiles;
            }));
            directory.allFiles = directory.allFiles.concat(directory.files);
        } else {
            directory.allFiles = directory.files;
        }
    }

    function getAllFilesByUrl (fileStructure) {
        fileStructure.allFilesByUrl = {};
        fileStructure.allFiles.forEach(function (file) {
            fileStructure.allFilesByUrl[file.url] = file;
        });
    }

    function updateFileStructure (fileStructure) {
        getAllFiles(fileStructure);
        getAllFilesByUrl(fileStructure);
        _fileStructure = fileStructure;
    }
};

Core.service('fileStructureService', FileStructureService);
