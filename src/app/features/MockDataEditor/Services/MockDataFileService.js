'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var MockDataEditor = require('../MockDataEditor');

// Dependencies:
require('./MockDataParserService');
require('../../../Core/Services/FileStructureService');

var MockDataFileService = function MockDataFileService (
    $http,
    MockDataParserService,
    FileStructureService
) {
    return {
        checkMockDataExists: checkMockDataExists,
        getAllMockData: getAllMockData,
        getMockDataFileStructure: getMockDataFileStructure,
        getMockDataPath: getMockDataPath,
        openMockData: openMockData,
        saveMockData: saveMockData
    };

    function checkMockDataExists (mockDataFileStructure, mockDataFilePath) {
        return !!findMockDataByPath(mockDataFileStructure, mockDataFilePath);
    }

    function getAllMockData () {
        return this.getMockDataFileStructure()
        .then(function (mockDataFileStructure) {
            return mockDataFileStructure.allFiles.map(function (mockDataFile) {
                return MockDataParserService.parse(mockDataFile);
            });
        });
    }

    function getMockDataFileStructure () {
        return FileStructureService.getFileStructure()
        .then(function (fileStructure) {
            return _.find(fileStructure.directories, function (directory) {
                return directory.name === 'mock_data';
            });
        });
    }

    function getMockDataPath (options) {
        return $http.get('/mock_data/path', {
            params: options
        });
    }

    function openMockData (mockDataFileStructure, mockDataFilePath) {
        var mockDataFile = findMockDataByPath(mockDataFileStructure, mockDataFilePath);
        return mockDataFile ? MockDataParserService.parse(mockDataFile) : null;
    }

    function saveMockData (options) {
        return $http.post('/save-mock-data-file', options);
    }

    function findMockDataByPath (mockDataFileStructure, mockDataFilePath) {
        return _.find(mockDataFileStructure.allFiles, function (mockDataFile) {
            return mockDataFile.path.includes(mockDataFilePath);
        });
    }
};

MockDataEditor.service('MockDataFileService', MockDataFileService);
