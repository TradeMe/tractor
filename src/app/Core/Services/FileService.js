'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
require('./FileStructureService');

var FileService = function FileService (
    $http,
    ParserService,
    fileStructureService,
    type
) {
    return {
        checkFileExists: checkFileExists,
        getFileStructure: getFileStructure,
        getPath: getPath,
        openFile: openFile,
        saveFile: saveFile
    };

    function checkFileExists (fileStructure, filePath) {
        return !!findFileByPath(fileStructure, filePath);
    }

    function findFileByPath (fileStructure, filePath) {
        return _.find(fileStructure.directory.allFiles, function (file) {
            return file.path.includes(filePath) || file.path.includes(filePath.replace(/\//g, '\\'));
        });
    }

    function getFileStructure () {
        return fileStructureService.getFileStructure(type);
    }

    function getPath (options) {
        if (options.name) {
            options.name = decodeURIComponent(options.name);
        }
        return $http.get('/' + type + '/file/path', {
            params: options
        });
    }

    function openFile (options, availableComponents, availableMockData, availableStepDefinitions) {
        if (options.path) {
            options.path = decodeURIComponent(options.path);
        }
        return $http.get('/' + type + '/file', {
            params: options
        })
        .then(function (file) {
            return type === 'features' ? ParserService.parse(file, availableStepDefinitions) : ParserService.parse(file, availableComponents, availableMockData);
        });
    }

    function saveFile (options) {
        return $http.put('/' + type + '/file', options);
    }
};

module.exports = FileService;
