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

        Object.defineProperties(this, {
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
    };

    FeatureModel.prototype.addScenario = function () {
        this.scenarios.push(new ScenarioModel());
    };

    FeatureModel.prototype.removeScenario = function (toRemove) {
        _.remove(this.scenarios, function (scenario) {
            return scenario === toRemove;
        });
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
