'use strict';

// Utilities:
var _ = require('lodash');
var os = require('os');

var FeatureLexerFormatter = function FeatureLexerFormatter () {
    this.features = [];

    Object.defineProperties(this, {
        lastFeature: {
            get: function () {
                return _.last(this.features);
            }
        },
        lastElement: {
            get: function () {
                return _.last(this.lastFeature.elements);
            }
        }
    });
};

FeatureLexerFormatter.prototype.feature = function (type, name, description) {
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
};

FeatureLexerFormatter.prototype.background = function (type, name, description) {
    var background = {
        type: type,
        name: name,
        description: description
    };
    background.examples = [];
    background.stepDeclarations = [];
    this.lastFeature.elements.push(background);
};

FeatureLexerFormatter.prototype.scenario = function (type, name, description) {
    var scenario = {
        type: type,
        name: name,
        description: description
    };
    scenario.examples = [];
    scenario.stepDeclarations = [];
    this.lastFeature.elements.push(scenario);
};

FeatureLexerFormatter.prototype.scenario_outline = function (type, name, description) {
    var scenario_outline = {
        type: type,
        name: name,
        description: description
    };
    scenario_outline.examples = [];
    scenario_outline.stepDeclarations = [];
    this.lastFeature.elements.push(scenario_outline);
};

FeatureLexerFormatter.prototype.row = function (row) {
    if (!this.lastElement.variables) {
        this.lastElement.variables = row;
    } else {
        this.lastElement.examples.push(row);
    }
};

FeatureLexerFormatter.prototype.step = function (type, step) {
    var stepDeclaration = {
        type: type.replace(/ $/, ''),
        step: step
    };
    this.lastElement.stepDeclarations.push(stepDeclaration);
};

FeatureLexerFormatter.prototype.done = function () {
    return this.features;
};

FeatureLexerFormatter.prototype.comment = _.noop;
FeatureLexerFormatter.prototype.doc_string = _.noop;
FeatureLexerFormatter.prototype.examples = _.noop;
FeatureLexerFormatter.prototype.eof = _.noop;
FeatureLexerFormatter.prototype.tag = _.noop;

module.exports = FeatureLexerFormatter;
