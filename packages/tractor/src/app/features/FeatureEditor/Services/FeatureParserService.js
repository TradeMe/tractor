'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var FeatureEditor = require('../FeatureEditor');

// Dependencies:
require('./ScenarioParserService');
require('../Models/FeatureModel');

var FeatureParserService = function FeatureParserService (
    ScenarioParserService,
    FeatureModel
) {
    return {
        parse: parse
    };

    function parse (tokens) {
        var feature = new FeatureModel();

        var featureTokens = _.first(tokens);
        feature.name = featureTokens.name;
        feature.inOrderTo = featureTokens.inOrderTo;
        feature.asA = featureTokens.asA;
        feature.iWant = featureTokens.iWant;

        _.each(featureTokens.elements, function (element, index) {
            var notScenario = false;

            try {
                var parsedScenario = ScenarioParserService.parse(feature, element);
                assert(parsedScenario);
                feature.scenarios.push(parsedScenario);
            } catch (e) {
                notScenario = true;
            }

            if (notScenario) {
                console.log(element, index);
            }
        });

        return feature;
    }
};

FeatureEditor.service('FeatureParserService', FeatureParserService);
