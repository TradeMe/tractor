'use strict';

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../Models/ParameterModel');

var ParameterParserService = function ParameterParserService (ParameterModel) {
    return {
        parse: parse
    };

    function parse (action, astObject) {
       var parameter = new ParameterModel(action);

       parameter.name = astObject.name;

       return parameter;
    }
};

ComponentEditor.service('ParameterParserService', ParameterParserService);
