'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var FeatureEditor = require('../FeatureEditor');

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

    function parse (feature, tokens) {
        var scenario = new ScenarioModel();

        scenario.name = tokens.name;
        scenario.scenarioTag = tokens.tags[0];

        _.each(tokens.stepDeclarations, function (stepDeclaration, index) {
            var notStep = false;

            try {
                var parsedStepDeclaration = StepDeclarationParserService.parse(stepDeclaration);
                assert(parsedStepDeclaration);
                scenario.stepDeclarations.push(parsedStepDeclaration);
            } catch (e) {
                notStep = true;
            }

            if (notStep) {
                console.log(stepDeclaration, index);
            }
        });

        _.each(tokens.examples, function (example, index) {
            var notExample = false;

            try {
                var parsedExample = ExampleParserService.parse(scenario, example);
                assert(parsedExample);
                scenario.examples.push(parsedExample);

            } catch (e) {
                notExample = true;
            }

            if (notExample) {
                console.log(example, index);
            }
        });

        return scenario;
    }
};

FeatureEditor.service('ScenarioParserService', ScenarioParserService);
