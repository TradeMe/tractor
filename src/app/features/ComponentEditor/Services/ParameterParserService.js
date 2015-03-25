'use strict';

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../Models/ParameterModel');

var ParameterParserService = function ParameterParserService (ParameterModel) {
    return {
        parse: parse
    };

    function parse (action) {
       return new ParameterModel(action);
    }
};

ComponentEditor.service('ParameterParserService', ParameterParserService);
