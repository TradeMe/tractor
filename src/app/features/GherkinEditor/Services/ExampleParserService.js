'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var GherkinEditor = require('../GherkinEditor');

// Dependencies:
require('../Models/ExampleModel');

var ExampleParserService = function ExampleParserService (ExampleModel) {
    return {
        parse: parse
    };

    function parse (scenario, tokens) {
        var example = new ExampleModel(scenario);

        _.each(scenario.exampleVariables, function (variable, index) {
            example.values[variable] = tokens[index].replace(/^"/, '').replace(/"$/, '');
        });

        return example;
    }
};

GherkinEditor.service('ExampleParserService', ExampleParserService);
