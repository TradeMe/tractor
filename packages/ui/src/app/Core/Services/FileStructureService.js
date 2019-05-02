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
        var _syncing = null;

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
            'file-structure-change': syncFileStructure
        });
        syncFileStructure();

        return service;

        function checkFileExists (fileStructure, fileUrl) {
            return !!fileStructure.allFilesByUrl[fileUrl];
        }

        function deleteItem (itemUrl, options) {
            return $http.delete('/fs' + itemUrl, {
                params: options
            });
        }

        function syncFileStructure (syncUrl) {
            _syncing = $http.get('/fs' + (syncUrl || fileStructureUrl))
            .then(updateFileStructure);
        }

        function getFileStructure () {
            return _syncing;
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

        function updateFileStructure (fileStructureChunk) {
            getAllFiles(fileStructureChunk);

            if (!_fileStructure) {
                getAllFilesByUrl(fileStructureChunk);
                _fileStructure = fileStructureChunk;
                _fileStructure.modified = 0;
                return;
            }

            var toReplace = fileStructureChunk.url.split('/').splice(2).reduce(function (p, n) {
                return p.directories.find(function (d) {
                    return d.basename === n;
                });
            }, _fileStructure);

            if (!toReplace) {
                var oldModified = _fileStructure.modified;
                getAllFilesByUrl(fileStructureChunk);
                _fileStructure = fileStructureChunk;
                _fileStructure.modified = oldModified + 1;
                return;
            }
            toReplace.allFiles.forEach(function (file) {
                delete _fileStructure.allFilesByPath[file.path];
                delete _fileStructure.allFilesByUrl[file.url];
            });
            fileStructureChunk.allFiles.forEach(function (file) {
                _fileStructure.allFilesByUrl[file.url] = file;
                _fileStructure.allFilesByPath[file.path] = file;
            });
            searching.directories.splice(searching.directories.indexOf(toReplace), 1, fileStructureChunk);
            _fileStructure.modified += 1;
        }
    };
}

Core.service('fileStructureServiceFactory', fileStructureServiceFactory);
