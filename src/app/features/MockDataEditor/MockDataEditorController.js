'use strict';

// Utilities:
var _ = require('lodash');

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
        FileStructureService,
        MockDataFileService,
        MockDataModel,
        mockDataFileStructure,
        mockData
    ) {
        this.$window = $window;
        this.$scope = $scope;
        this.notifierService = NotifierService;

        this.fileStructureService = FileStructureService;
        this.mockDataFileService = MockDataFileService;

        this.fileStructure = mockDataFileStructure;
        this.mockData = mockData || new MockDataModel();
    };

    MockDataEditorController.prototype.saveMockDataFile = function () {
        var json = this.mockData.json;
        var name = this.mockData.name;

        var exists = fileAlreadyExists(name, this.fileStructure);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.mockDataFileService.saveMockDataFile(json, name)
            .then(function () {
                this.mockData.isSaved = true;
                return this.fileStructureService.getFileStructure('mock_data');
            }.bind(this))
            .then(function (mockDataFileStructure) {
                this.fileStructure = mockDataFileStructure;
            }.bind(this));
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

    function fileAlreadyExists (fileName, directory) {
        return _.some(directory, function (info, name) {
            if (info['-type'] === 'd') {
                // Directory:
                return fileAlreadyExists(fileName, info);
            } else if (name !== '-type' && name !== '-path') {
                // File:
                return new RegExp(fileName + '\.').test(name);
            }
        });
    }

    return MockDataEditorController;
})();

MockDataEditor.controller('MockDataEditorController', MockDataEditorController);
