'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var FeatureEditor = require('../FeatureEditor');

// Dependencies:
require('./ScenarioModel');

var createFeatureModelConstructor = function (
    ScenarioModel,
    FeatureIndent,
    FeatureNewLine,
    config
) {
    var FeatureModel = function FeatureModel (options, availableStepDefinitions) {
        var scenarios = [];

        this.featureTags = config.tags;

        Object.defineProperties(this, {
            // TODO: Not sure why this is here, it
            // should probably be on the FeatureEditorController
            availableStepDefinitions: {
                get: function () {
                    return _.map(availableStepDefinitions, function(stepDefinition) {
                        return {
                            type: stepDefinition.name.substring(0, stepDefinition.name.indexOf(' ')),
                            name: stepDefinition.name.substring(stepDefinition.name.indexOf(' ') + 1),
                            path: stepDefinition.path
                        }
                    });
                }
            },
            isSaved: {
                get: function () {
                    return !!(options && options.isSaved);
                }
            },
            url: {
                get: function () {
                    return options && options.url;
                }
            },
            scenarios: {
                get: function () {
                    return scenarios;
                }
            },
            featureString: {
                get: function () {
                    return toFeatureString.call(this);
                }
            },
            data: {
                get: function () {
                    return this.featureString;
                }
            }
        });

        this.name = '';
        this.inOrderTo = '';
        this.asA = '';
        this.iWant = '';
        this.featureTag = _.first(this.featureTags);
    };

    FeatureModel.prototype.addScenario = function () {
        this.scenarios.push(new ScenarioModel());
    };

    FeatureModel.prototype.removeScenario = function (toRemove) {
        _.remove(this.scenarios, function (scenario) {
            return scenario === toRemove;
        });
    };

    // TODO: This should also be on the FeatureEditorController
    FeatureModel.prototype.findStep = function (step) {
        var stepDefinition = _.find(this.availableStepDefinitions, function(stepDefinition){
            return stepDefinition.name.replace(/[_]/g,'') === step.replace(/[*_\/|"<>?]/g, '');
        });
        return stepDefinition;
    };

    return FeatureModel;

    function toFeatureString () {
        var featureTag = this.featureTag || '';
        var feature = 'Feature: ' + this.name;

        var inOrderTo = FeatureIndent + 'In order to ' + this.inOrderTo;
        var asA = FeatureIndent + 'As a ' + this.asA;
        var iWant = FeatureIndent + 'I want ' + this.iWant;

        var scenarios = _.map(this.scenarios, function (scenario) {
            return FeatureIndent + scenario.featureString;
        });

        var lines = _.flatten([featureTag, feature, inOrderTo, asA, iWant, scenarios]);
        return lines.join(FeatureNewLine);
    }
};

FeatureEditor.factory('FeatureModel', function (
    ScenarioModel,
    FeatureIndent,
    FeatureNewLine,
    config
) {
    return createFeatureModelConstructor(ScenarioModel, FeatureIndent, FeatureNewLine, config);
});
