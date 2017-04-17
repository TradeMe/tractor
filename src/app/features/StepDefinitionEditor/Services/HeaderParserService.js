'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../Models/HeaderModel');

var HeaderParserService = function HeaderParserService (
    HeaderModel
) {
    return {
        parse: parse
    };

    function parse (mock, ast) {
        try {
            var header = new HeaderModel(mock);

            try {
                parseKey(header, ast);
                parseValue(header, ast);
                return header;
            } catch (e) { }

            throw new Error();
        } catch (e) {
            console.warn('Invalid header:', ast);
            return null;
        }
    }

    function parseKey (header, ast) {
        var key = ast.key.value;
        assert(key);
        header.key = key;
    }

    function parseValue (header, ast) {
        var value = ast.value.value;
        assert(value);
        header.value = value;
    }
};

StepDefinitionEditor.service('HeaderParserService', HeaderParserService);
