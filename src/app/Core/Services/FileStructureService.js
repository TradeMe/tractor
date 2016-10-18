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
        copyItem: copyItem,
        deleteItem: deleteItem,
        editDirectoryPath: editDirectoryPath,
        editFilePath: editFilePath,
        getFileStructure: getFileStructure,
        openItem: openItem,
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

    function copyItem (itemUrl) {
        return $http.post('/fs' + itemUrl + '/copy')
        .then(updateFileStructure.bind(this));
    }

    function deleteItem (itemUrl, options) {
        return $http.delete('/fs' + itemUrl, {
            params: options
        })
        .then(updateFileStructure.bind(this));
    }

    function editDirectoryPath (type, options) {
        options.isDirectory = true;
        return $http.patch('/' + type + '/directory/path', options);
    }

    function editFilePath (type, options) {
        return $http.patch('/' + type + '/file/path', options);
    }

    function getFileStructure (extension) {
        return $http.get('/fs/')
        .then(updateFileStructure.bind(this));
    }

    function openItem (itemUrl) {
        itemUrl = decodeURIComponent(itemUrl);
        return $http.get('/fs' + itemUrl);
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
