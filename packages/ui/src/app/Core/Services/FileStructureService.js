'use strict';

// Module:
var Core = require('../Core');

// Constants:
var URL_SEPERATOR = '/';

function fileStructureServiceFactory (
    $http,
    realTimeService
) {
    return function (fileStructureUrl) {
        var _fileStructure = null;

        if (!fileStructureUrl.startsWith(URL_SEPERATOR)) {
            fileStructureUrl = URL_SEPERATOR + fileStructureUrl;
        }
        if (!fileStructureUrl.endsWith(URL_SEPERATOR)) {
            fileStructureUrl = fileStructureUrl + URL_SEPERATOR;
        }

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

        realTimeService.connect('watch-file-structure' + fileStructureUrl, {
            'file-structure-change': getFileStructure
        });
        getFileStructure();

        return service;

        function checkFileExists (fileStructure, fileUrl) {
            return !!fileStructure.allFilesByUrl[fileUrl];
        }

        function deleteItem (itemUrl, options) {
            return $http.delete('/fs' + itemUrl, {
                params: options
            });
        }

        function getFileStructure () {
            return $http.get('/fs' + fileStructureUrl)
            .then(updateFileStructure);
        }

        function moveItem (itemUrl, options) {
            return $http.post('/fs/move' + itemUrl, options);
        }

        function openItem (itemUrl) {
            itemUrl = decodeURIComponent(itemUrl);
            return $http.get('/fs' + itemUrl);
        }

        function refactorItem (itemUrl, options) {
            return $http.post('/fs/refactor' + itemUrl, {
                update: options
            });
        }

        function saveItem (itemUrl, options) {
            return $http.put('/fs' + itemUrl, options);
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
            fileStructure.allFilesByPath = {};
            fileStructure.allFiles.forEach(function (file) {
                fileStructure.allFilesByUrl[file.url] = file;
                fileStructure.allFilesByPath[file.path] = file;
            });
        }

        function updateFileStructure (fileStructure) {
            getAllFiles(fileStructure);
            getAllFilesByUrl(fileStructure);
            _fileStructure = fileStructure;
        }
    };
}

Core.service('fileStructureServiceFactory', fileStructureServiceFactory);
