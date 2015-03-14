'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

// Module:
var MockDataEditor = require('../MockDataEditor');

// Dependencies:
require('./MockDataParserService');

var MockDataFileService = function MockDataFileService (
    $http,
    MockDataParserService
) {
    return {
        openMockDataFile: openMockDataFile,
        saveMockDataFile: saveMockDataFile,
        getMockDataFileNames: getMockDataFileNames,
        getAllMockData: getAllMockData
    };

    function openMockDataFile (fileName) {
        return $http.get('/open-mock-data-file?name=' + encodeURIComponent(fileName));
    }

    function saveMockDataFile (data, name) {
        return $http.post('/save-mock-data-file', {
            data: data,
            name: name
        });
    }

    function getMockDataFileNames () {
        return $http.get('/get-mock-data-file-names');
    }

    function getAllMockData () {
        return this.getMockDataFileNames()
        .then(function (mockDataFileNames) {
            var openMockDataFiles = _.map(mockDataFileNames, function (mockDataFileName) {
                return openMockDataFile(mockDataFileName);
            });
            return Promise.all(openMockDataFiles)
            .then(function (results) {
                return _.map(results, function (result, index) {
                    return MockDataParserService.parse(result.contents, mockDataFileNames[index]);
                });
            });
        });
    }
};

MockDataEditor.service('MockDataFileService', MockDataFileService);
