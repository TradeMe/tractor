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
        MockDataFileService,
        MockDataParserService,
        MockDataModel,
        mockDataFileNames
    ) {
        this.mockDataFileService = MockDataFileService;
        this.mockDataParserService = MockDataParserService;

        this.mockDataFileNames = mockDataFileNames;

        this.mockData = new MockDataModel();
    };

    MockDataEditorController.prototype.openMockDataFile = function (filename) {
        this.mockDataFileService.openMockDataFile(filename)
        .then(_.bind(function (data) {
            try {
                this.mockData = this.mockDataParserService.parse(data.contents, filename);
            } catch (e) { }
        }, this));
    };

    MockDataEditorController.prototype.saveMockDataFile = function () {
        this.mockDataFileService.saveMockDataFile(this.mockData.name, this.mockData.json);
    };

    return MockDataEditorController;
})();

MockDataEditor.controller('MockDataEditorController', MockDataEditorController);
