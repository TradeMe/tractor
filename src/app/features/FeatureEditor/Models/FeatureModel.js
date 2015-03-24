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
    FeatureNewLine
) {
    var FeatureModel = function FeatureModel (options) {
        var scenarios = [];
        this.isSaved = !!(options && options.isSaved);

        Object.defineProperties(this, {
            scenarios: {
                get: function () {
                    return scenarios;
                }
            },
            featureString: {
                get: function () {
                    return toFeatureString.call(this);
                }
            }
        });

        this.name = '';
        this.inOrderTo = '';
        this.asA = '';
        this.iWant = '';
    };

    FeatureModel.prototype.addScenario = function () {
        this.scenarios.push(new ScenarioModel());
    };

    FeatureModel.prototype.removeScenario = function (scenario) {
        _.remove(this.scenarios, scenario);
    };

    return FeatureModel;

    function toFeatureString () {
        var feature = 'Feature: ' + this.name;

        var inOrderTo = FeatureIndent + 'In order to ' + this.inOrderTo;
        var asA = FeatureIndent + 'As a ' + this.asA;
        var iWant = FeatureIndent + 'I want ' + this.iWant;

        var scenarios = _.map(this.scenarios, function (scenario) {
            return FeatureIndent + scenario.featureString;
        });

        var lines = _.flatten([feature, inOrderTo, asA, iWant, scenarios]);
        return lines.join(FeatureNewLine);
    }
};

FeatureEditor.factory('FeatureModel', function (
    ScenarioModel,
    FeatureIndent,
    FeatureNewLine
) {
    return createFeatureModelConstructor(ScenarioModel, FeatureIndent, FeatureNewLine);
});
