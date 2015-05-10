'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
require('./FileStructureService');

var FileService = function FileService (
    $http,
    ParserService,
    FileStructureService,
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
        return _.find(fileStructure.allFiles, function (file) {
            return file.path.includes(filePath);
        });
    }

    function getFileStructure () {
        return FileStructureService.getFileStructure()
        .then(function (fileStructure) {
            return _.find(fileStructure.directories, function (directory) {
                return directory.name === type;
            });
        });
    }

    function getPath (options) {
        if (options.path) {
            options.path = decodeURIComponent(options.path);
        }
        return $http.get('/' + type + '/file/path', {
            params: options
        });
    }

    function openFile (fileStructure, filePath, components, mockData) {
        var file = findFileByPath(fileStructure, filePath);
        return file ? ParserService.parse(file, components, mockData) : null;
    }

    function saveFile (options) {
        return $http.put('/' + type + '/file', options);
    }
};

module.exports = FileService;
