'use strict';

// Module:
var MockDataEditor = require('./MockDataEditor');

// Dependencies:
require('./Services/MockDataFileService');
require('./Models/MockDataModel');

var MockDataEditorController = (function () {
    var MockDataEditorController = function MockDataEditorController (
        $scope,
        $window,
        NotifierService,
        MockDataFileService,
        MockDataModel,
        mockDataFileStructure,
        mockDataPath
    ) {
        this.$window = $window;
        this.$scope = $scope;
        this.notifierService = NotifierService;

        this.mockDataFileService = MockDataFileService;

        this.fileStructure = mockDataFileStructure;

        if (mockDataPath) {
            this.mockData = this.mockDataFileService.openMockData(this.fileStructure, mockDataPath.path);
        }
        this.mockData = this.mockData || new MockDataModel();
    };

    MockDataEditorController.prototype.saveMockDataFile = function () {
        this.mockDataFileService.getMockDataPath({
            name: this.mockData.name,
            path: this.mockData.path
        })
        .then(function (mockDataPath) {
            var exists = this.mockDataFileService.checkMockDataExists(this.fileStructure, mockDataPath.path);

            if (!exists || this.$window.confirm('This will overwrite "' + this.mockData.name + '". Continue?')) {
                this.mockDataFileService.saveMockData({
                    data: this.mockData.json,
                    name: this.mockData.name,
                    path: mockDataPath.path
                })
                .then(function () {
                    return this.mockDataFileService.getMockDataFileStructure();
                }.bind(this))
                .then(function (mockDataFileStructure) {
                    this.fileStructure = mockDataFileStructure;
                    this.mockData = this.mockDataFileService.openMockData(this.fileStructure, mockDataPath.path);
                }.bind(this));
            }
        }.bind(this));
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

    return MockDataEditorController;
})();

MockDataEditor.controller('MockDataEditorController', MockDataEditorController);
