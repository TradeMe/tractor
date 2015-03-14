'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var MockDataEditor = require('./MockDataEditor');

// Dependencies:
require('./Services/MockDataFileService');
require('./Services/MockDataParserService');
require('./Models/MockDataModel');

var MockDataEditorController = (function () {
    var MockDataEditorController = function MockDataEditorController (
        $stateParams,
        MockDataFileService,
        MockDataParserService,
        MockDataModel,
        mockDataFileNames,
        mockDataFile
    ) {
        this.mockDataFileService = MockDataFileService;
        this.mockDataParserService = MockDataParserService;

        this.mockDataFileNames = mockDataFileNames;

        if (mockDataFile) {
            parseMockDataFile.call(this, $stateParams.mockData, mockDataFile);
        } else {
            this.mockData = new MockDataModel();
        }
    };

    MockDataEditorController.prototype.openMockDataFile = function (fileName) {
        this.mockDataFileService.openMockDataFile(fileName)
        .then(parseMockDataFile.bind(this, fileName));
    };

    MockDataEditorController.prototype.saveMockDataFile = function () {
        this.mockDataFileService.saveMockDataFile(this.mockData.name, this.mockData.json);
    };

    function parseMockDataFile (fileName, mockDataFile) {
        try {
            this.mockData = this.mockDataParserService.parse(mockDataFile.contents, fileName);
        } catch (e) { }
    }

    return MockDataEditorController;
})();

MockDataEditor.controller('MockDataEditorController', MockDataEditorController);
