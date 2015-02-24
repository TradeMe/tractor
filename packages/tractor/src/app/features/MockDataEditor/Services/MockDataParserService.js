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
        var mockDataModel = new MockDataModel(json);
        mockDataModel.name = name;
        return mockDataModel;
    }
};

MockDataEditor.service('MockDataParserService', MockDataParserService);
