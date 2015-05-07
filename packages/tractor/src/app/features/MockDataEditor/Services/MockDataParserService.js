'use strict';

// Module:
var MockDataEditor = require('../MockDataEditor');

// Dependencies:
require('../Models/MockDataModel');

var MockDataParserService = function MockDataParserService (MockDataModel) {
    return {
        parse: parse
    };

    function parse (mockDataFile) {
        try {
            var mockDataModel = new MockDataModel(mockDataFile.content, {
                isSaved: true,
                path: mockDataFile.path
            });
            mockDataModel.name = mockDataFile.name;
            return mockDataModel;
        } catch (e) {
            return new MockDataModel();
        }
    }
};

MockDataEditor.service('MockDataParserService', MockDataParserService);
