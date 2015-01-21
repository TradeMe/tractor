'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var GherkinEditor = require('../GherkinEditor');

// Dependencies:
require('./ScenarioModel');

var GherkinModel = function (
    ScenarioModel,
    GherkinIndent,
    GherkinNewLine
) {
    var DEFAULTS = {
        name: 'Gherkin',
        inOrderTo: 'achieve some goal',
        asA: 'certain type of user',
        iWant: 'to be able to do something'
    };

    var GherkinModel = function GherkinModel () {
        var scenarios = [];

        Object.defineProperties(this, {
            scenarios: {
                get: function () { return scenarios; }
            },
            feature: {
                get: function () { return toFeature.call(this); }
            }
        });

        this.name = DEFAULTS.name;
        this.inOrderTo = DEFAULTS.inOrderTo;
        this.asA = DEFAULTS.asA;
        this.iWant = DEFAULTS.iWant;
    };

    GherkinModel.prototype.addScenario = function () {
        this.scenarios.push(new ScenarioModel());
    };

    GherkinModel.prototype.removeScenario = function (scenario) {
        _.remove(this.scenarios, scenario);
    };

    GherkinModel.prototype.setValidValue = function (property, value) {
        this[property] = value || DEFAULTS[property];
    };


    var toFeature = function () {
        var feature = 'Feature: ' + this.name;

        var inOrderTo = GherkinIndent + 'In order to ' + this.inOrderTo;
        var asA = GherkinIndent + 'As a ' + this.asA;
        var iWant = GherkinIndent + 'I want ' + this.iWant;

        var scenarios = _.map(this.scenarios, function (scenario) {
            return GherkinIndent + scenario.feature;
        });

        var lines = _.flatten([feature, inOrderTo, asA, iWant, scenarios]);
        return lines.join(GherkinNewLine);
    };

    return GherkinModel;
};

GherkinEditor.factory('GherkinModel', function (
    ScenarioModel,
    GherkinIndent,
    GherkinNewLine
) {
    return GherkinModel(ScenarioModel, GherkinIndent, GherkinNewLine);
});
