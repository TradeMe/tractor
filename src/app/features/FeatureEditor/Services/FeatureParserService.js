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

    function parse (featureFile) {
        try {
            var feature = new FeatureModel({
                isSaved: true,
                url: featureFile.url
            });

            var featureTokens = _.first(featureFile.tokens);
            feature.name = featureTokens.name;
            feature.inOrderTo = featureTokens.inOrderTo;
            feature.asA = featureTokens.asA;
            feature.iWant = featureTokens.iWant;
            if (featureTokens.tags.length) {
                feature.featureTag = _.first(featureTokens.tags);
            }
            
            _.each(featureTokens.elements, function (element, index) {
                try {
                    var parsedScenario = ScenarioParserService.parse(feature, element);
                    assert(parsedScenario);
                    feature.scenarios.push(parsedScenario);
                    return;
                } catch (e) { }

                console.warn('Invalid Feature:', element, index);
            });

            return feature;
        } catch (e) {
            return new FeatureModel();
        }
    }
};

FeatureEditor.service('FeatureParserService', FeatureParserService);
