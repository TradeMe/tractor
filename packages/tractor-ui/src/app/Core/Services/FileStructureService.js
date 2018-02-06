'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

function fileStructureServiceFactory (
    $http,
    realTimeService
) {
    return function (baseURL) {
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

        realTimeService.connect(baseURL + '/watch-file-structure', {
            'file-structure-change': getFileStructure
        });
        getFileStructure();

        return service;

        function checkFileExists (fileStructure, fileUrl) {
            return !!fileStructure.allFilesByUrl[fileUrl];
        }

        function deleteItem (itemUrl, options) {
            return $http.delete('/' + baseURL + '/fs' + itemUrl, {
                params: options
            });
        }

        function getFileStructure () {
            return $http.get('/' + baseURL + '/fs/')
            .then(updateFileStructure);
        }

        function moveItem (itemUrl, options) {
            return $http.post('/' + baseURL + '/fs/move' + itemUrl, options);
        }

        function openItem (itemUrl) {
            itemUrl = decodeURIComponent(itemUrl);
            return $http.get('/' + baseURL + '/fs' + itemUrl);
        }

        function refactorItem (itemUrl, options) {
            return $http.post('/' + baseURL + '/fs/refactor' + itemUrl, {
                update: options
            });
        }

        function saveItem (itemUrl, options) {
            return $http.put('/' + baseURL + '/fs' + itemUrl, options);
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
};

Core.service('fileStructureServiceFactory', fileStructureServiceFactory);
