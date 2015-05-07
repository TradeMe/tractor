'use strict';

// Module:
var MockDataEditor = require('../MockDataEditor');

// Dependencies:
var FileService = require('../../../Core/Services/FileService');
require('./MockDataParserService');
require('../../../Core/Services/FileStructureService');

var MockDataFileService = function MockDataFileService (
    $http,
    MockDataParserService,
    FileStructureService
) {
    var service = FileService($http, MockDataParserService, FileStructureService, 'mock_data');
    service.getAll = getAll;
    return service;


    function getAll () {
        return this.getFileStructure()
        .then(function (fileStructure) {
            return fileStructure.allFiles.map(function (file) {
                return MockDataParserService.parse(file);
            });
        });
    }
};

MockDataEditor.service('MockDataFileService', MockDataFileService);
