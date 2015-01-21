'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var GherkinEditor = require('../GherkinEditor');

// Dependencies:
require('./ScenarioParserService');
require('../Models/GherkinModel');

var GherkinParserService = function GherkinParserService (
    ScenarioParserService,
    GherkinModel
) {
    return {
        parse: parse
    };

    function parse (tokens) {
        var gherkin = new GherkinModel();

        var feature = _.first(tokens);
        gherkin.name = feature.name;
        gherkin.inOrderTo = feature.inOrderTo;
        gherkin.asA = feature.asA;
        gherkin.iWant = feature.iWant;

        _.each(feature.elements, function (element, index) {
            var notScenario = false;

            try {
                var scenario = ScenarioParserService.parse(gherkin, element);
                assert(scenario);
                gherkin.scenarios.push(scenario);
            } catch (e) { notScenario = true; }

            if (notScenario) {
                console.log(element, index);
            }
        });

        return gherkin;
    }
};

GherkinEditor.service('GherkinParserService', GherkinParserService);
