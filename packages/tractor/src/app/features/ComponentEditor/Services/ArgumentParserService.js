'use strict';

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../Models/ArgumentModel');

var ArgumentParserService = function ArgumentParserService (ArgumentModel) {
    return {
        parse: parse
    };

    function parse (method, argument, astObject) {
        argument = new ArgumentModel(method, argument);
        argument.value = astObject.name || astObject.value;

        return argument;
    }
};

ComponentEditor.service('ArgumentParserService', ArgumentParserService);
