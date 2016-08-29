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
    fileStructureService
) {
    return FileService($http, MockDataParserService, fileStructureService, 'mock-data');
};

MockDataEditor.service('MockDataFileService', MockDataFileService);
