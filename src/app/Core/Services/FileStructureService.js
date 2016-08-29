'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

var FileStructureService = function FileStructureService (
    $http,
    persistentStateService,
    ComponentParserService,
    MockDataParserService
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

    function getFileStructure (type) {
        return $http.get('/' + type + '/file-structure')
        .then(parseComponentsAndMockData)
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

    function parseComponentsAndMockData (fileStructure) {
        fileStructure.availableComponents = _.map(fileStructure.availableComponents, function (component) {
            return ComponentParserService.parse(component);
        });
        fileStructure.availableMockData = _.map(fileStructure.availableMockData, function (mockData) {
            return MockDataParserService.parse(mockData);
        });
        return fileStructure;
    }

    function updateFileStructure (fileStructure) {
        fileStructure.directory = restoreOpenDirectories(fileStructure.directory);
        fileStructure.directory.allFiles = getAllFiles(fileStructure.directory);
        fileStructure.directory.open = true;
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

    function getAllFiles (directory, allFiles) {
        if (!allFiles) {
            allFiles = [];
        }
        _.each(directory.directories, function (directory) {
            allFiles = getAllFiles(directory, allFiles);
        })
        allFiles = allFiles.concat(directory.files);
        return allFiles;
    }
};

Core.service('fileStructureService', FileStructureService);
