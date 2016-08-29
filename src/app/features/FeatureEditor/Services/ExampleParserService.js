'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var FeatureEditor = require('../FeatureEditor');

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

FeatureEditor.service('ExampleParserService', ExampleParserService);
