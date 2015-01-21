'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var GherkinEditor = require('../GherkinEditor');

// Dependencies:
require('./StepDeclarationParserService');
require('./ExampleParserService');
require('../Models/ScenarioModel');

var ScenarioParserService = function ScenarioParserService (
    StepDeclarationParserService,
    ExampleParserService,
    ScenarioModel
) {
    return {
        parse: parse
    };

    function parse (gherkin, tokens) {
        var scenario = new ScenarioModel();

        scenario.name = tokens.name;

        _.each(tokens.stepDeclarations, function (stepDeclaration, index) {
            var notStep = false;

            try {
                var stepDeclaration = StepDeclarationParserService.parse(stepDeclaration);
                assert(stepDeclaration);
                scenario.stepDeclarations.push(stepDeclaration);
            } catch (e) { notStep = true; }

            if (notStep) {
                console.log(step, index);
            }
        });

        _.each(tokens.examples, function (example, index) {
            var notExample = false;

            try {
                var example = ExampleParserService.parse(scenario, example);
                assert(example);
                scenario.examples.push(example);

            } catch (e) { notExample = true; }

            if (notExample) {
                console.log(element, index);
            }
        });

        return scenario;
    }
};

GherkinEditor.service('ScenarioParserService', ScenarioParserService);
