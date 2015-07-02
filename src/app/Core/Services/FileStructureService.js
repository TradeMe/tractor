'use strict';

// Module:
var Core = require('../Core');

var FileStructureService = function FileStructureService (
    $http,
    persistentStateService
) {
    var OPEN_DIRECTORIES = 'OpenDirectories';

    return {
        getFileStructure: getFileStructure,
        addDirectory: addDirectory,
        copyFile: copyFile,
        deleteDirectory: deleteDirectory,
        deleteFile: deleteFile,
        editDirectoryPath: editDirectoryPath,
        editFilePath: editFilePath,
        toggleOpenDirectory: toggleOpenDirectory
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

    function toggleOpenDirectory (directoryPath) {
        var openDirectories = getOpenDirectories();
        if (openDirectories[directoryPath]) {
            delete openDirectories[directoryPath];
        } else {
            openDirectories[directoryPath] = true;
        }
        persistentStateService.set(OPEN_DIRECTORIES, openDirectories);
    }

    function updateFileStructure (fileStructure) {
        fileStructure = restoreOpenDirectories(fileStructure);
        fileStructure.directories.forEach(function (topLevelDirectory) {
            topLevelDirectory.open = true;
        });
        return fileStructure;
    }

    function getOpenDirectories () {
        return persistentStateService.get(OPEN_DIRECTORIES);
    }

    function restoreOpenDirectories (directory) {
        directory.directories.forEach(function (directory) {
            restoreOpenDirectories(directory);
        });
        directory.open = !!getOpenDirectories()[directory.path];
        return directory;
    }
};

Core.service('FileStructureService', FileStructureService);
