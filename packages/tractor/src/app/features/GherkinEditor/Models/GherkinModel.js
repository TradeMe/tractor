'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var GherkinEditor = require('../GherkinEditor');

// Dependencies:
require('./ScenarioModel');

var createGherkinModelConstructor = function (
    ScenarioModel,
    GherkinIndent,
    GherkinNewLine
) {
var GherkinModel = function GherkinModel () {
        var scenarios = [];

        Object.defineProperties(this, {
            scenarios: {
                get: function () {
                    return scenarios;
                }
            },
            feature: {
                get: function () {
                    return toFeature.call(this);
                }
            }
        });

        this.name = '';
        this.inOrderTo = '';
        this.asA = '';
        this.iWant = '';
    };

    GherkinModel.prototype.addScenario = function () {
        this.scenarios.push(new ScenarioModel());
    };

    GherkinModel.prototype.removeScenario = function (scenario) {
        _.remove(this.scenarios, scenario);
    };

    return GherkinModel;

    function toFeature () {
        var feature = 'Feature: ' + this.name;

        var inOrderTo = GherkinIndent + 'In order to ' + this.inOrderTo;
        var asA = GherkinIndent + 'As a ' + this.asA;
        var iWant = GherkinIndent + 'I want ' + this.iWant;

        var scenarios = _.map(this.scenarios, function (scenario) {
            return GherkinIndent + scenario.feature;
        });

        var lines = _.flatten([feature, inOrderTo, asA, iWant, scenarios]);
        return lines.join(GherkinNewLine);
    }
};

GherkinEditor.factory('GherkinModel', function (
    ScenarioModel,
    GherkinIndent,
    GherkinNewLine
) {
    return createGherkinModelConstructor(ScenarioModel, GherkinIndent, GherkinNewLine);
});
