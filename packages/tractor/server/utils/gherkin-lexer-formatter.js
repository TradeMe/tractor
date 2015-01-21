'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
var os = require('os');

module.exports = (function () {
    return constructor;

    function constructor () {
        this.features = [];

        Object.defineProperties(this, {
            lastFeature: {
                get: function () { return _.last(this.features); }
            },
            lastElement: {
                get: function () { return _.last(this.lastFeature.elements); }
            }
        });

        this.feature = feature;
        this.background = background;
        this.scenario = scenario;
        this.scenario_outline = scenario_outline;
        this.row = row;
        this.step = step;

        this.comment = _.noop;
        this.doc_string = _.noop;
        this.examples = _.noop;
        this.eof = _.noop;
        this.tag = _.noop;

        this.done = done;
    }

    function feature (type, name, description) {
        var feature = {
            type: type,
            name: name
        };
        var descriptions = description.split(os.EOL);
        feature.inOrderTo = descriptions[0].replace(/^In order to /, '');
        feature.asA = descriptions[1].replace(/^As a /, '');
        feature.iWant = descriptions[2].replace(/^I want /, '');
        feature.elements = [];
        this.features.push(feature);
    }

    function background (type, name, description) {
        var background = {
            type: type,
            name: name,
            description: description
        };
        background.examples = [];
        background.stepDeclarations = [];
        this.lastFeature.elements.push(background);
    }

    function scenario (type, name, description) {
        var scenario = {
            type: type,
            name: name,
            description: description
        };
        scenario.examples = [];
        scenario.stepDeclarations = [];
        this.lastFeature.elements.push(scenario);
    }

    function scenario_outline (type, name, description) {
        var scenario_outline = {
            type: type,
            name: name,
            description: description
        };
        scenario_outline.examples = [];
        scenario_outline.stepDeclarations = [];
        this.lastFeature.elements.push(scenario_outline);
    }

    function row (row) {
        if (!this.lastElement.variables) {
            this.lastElement.variables = row;
        } else {
            this.lastElement.examples.push(row);
        }
    }

    function step (type, regex) {
        var step = {
            type: type.replace(/ $/, ''),
            step: regex
        };
        this.lastElement.stepDeclarations.push(step);
    }

    function done () {
        return this.features;
    }
})();
