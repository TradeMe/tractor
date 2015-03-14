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
        $scope,
        $window,
        NotifierService,
        MockDataFileService,
        MockDataParserService,
        MockDataModel,
        mockDataFileNames,
        mockDataFile
    ) {
        this.$window = $window;
        this.$scope = $scope;
        this.notifierService = NotifierService;

        this.mockDataFileService = MockDataFileService;
        this.mockDataParserService = MockDataParserService;

        this.mockDataFileNames = mockDataFileNames;

        if (mockDataFile) {
            parseMockDataFile.call(this, $stateParams.mockData, mockDataFile);
        } else {
            this.mockData = new MockDataModel();
        }
    };

    MockDataEditorController.prototype.saveMockDataFile = function () {
        var mockDataFileNames = this.mockDataFileNames;
        var json = this.mockData.json;
        var name = this.mockData.name;

        var exists = _.contains(mockDataFileNames, name);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.mockDataFileService.saveMockDataFile(json, name)
            .then(function () {
                if (!exists) {
                    mockDataFileNames.push(name);
                }
            });
        }
    };

    MockDataEditorController.prototype.showErrors = function () {
        var mockDataEditor = this.$scope['mock-data-editor'];
        if (mockDataEditor.$invalid) {
            Object.keys(mockDataEditor.$error).forEach(function (invalidType) {
                var errors = mockDataEditor.$error[invalidType];
                errors.forEach(function (element) {
                    element.$setTouched();
                });
            });
            this.notifierService.error('Can\'t save mock data, something is invalid.');
            return false;
        } else {
            return true;
        }
    };

    function parseMockDataFile (fileName, mockDataFile) {
        try {
            this.mockData = this.mockDataParserService.parse(mockDataFile.contents, fileName);
        } catch (e) { }
    }

    return MockDataEditorController;
})();

MockDataEditor.controller('MockDataEditorController', MockDataEditorController);
