'use strict';

// Module:
var MockDataEditor = require('../MockDataEditor');

// Dependencies:
require('../Models/MockDataModel');

var MockDataParserService = function MockDataParserService (MockDataModel) {
    return {
        parse: parse
    };

    function parse (json, name) {
        try {
            var mockDataModel = new MockDataModel(json, {
                isSaved: true
            });
            mockDataModel.name = name;
            return mockDataModel;
        } catch (e) {
            return new MockDataModel();
        }
    }
};

MockDataEditor.service('MockDataParserService', MockDataParserService);
