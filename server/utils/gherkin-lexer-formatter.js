'use strict';

// Utilities:
var last = require('array-last');
var noop = require('node-noop');
var os = require('os');

var GherkinLexerFormatter = function GherkinLexerFormatter () {
    this.features = [];

    Object.defineProperties(this, {
        lastFeature: {
            get: function () {
                return last(this.features);
            }
        },
        lastElement: {
            get: function () {
                return last(this.lastFeature.elements);
            }
        }
    });
};

GherkinLexerFormatter.prototype.feature = function (type, name, description) {
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

GherkinLexerFormatter.prototype.background = function (type, name, description) {
    var background = {
        type: type,
        name: name,
        description: description
    };
    background.examples = [];
    background.stepDeclarations = [];
    this.lastFeature.elements.push(background);
};

GherkinLexerFormatter.prototype.scenario = function (type, name, description) {
    var scenario = {
        type: type,
        name: name,
        description: description
    };
    scenario.examples = [];
    scenario.stepDeclarations = [];
    this.lastFeature.elements.push(scenario);
};

GherkinLexerFormatter.prototype.scenario_outline = function (type, name, description) {
    var scenario_outline = {
        type: type,
        name: name,
        description: description
    };
    scenario_outline.examples = [];
    scenario_outline.stepDeclarations = [];
    this.lastFeature.elements.push(scenario_outline);
};

GherkinLexerFormatter.prototype.row = function (row) {
    if (!this.lastElement.variables) {
        this.lastElement.variables = row;
    } else {
        this.lastElement.examples.push(row);
    }
};

GherkinLexerFormatter.prototype.step = function (type, step) {
    var stepDeclaration = {
        type: type.replace(/ $/, ''),
        step: step
    };
    this.lastElement.stepDeclarations.push(stepDeclaration);
};

GherkinLexerFormatter.prototype.done = function () {
    return this.features;
};

GherkinLexerFormatter.prototype.comment = noop.noop;
GherkinLexerFormatter.prototype.doc_string = noop.noop;
GherkinLexerFormatter.prototype.examples = noop.noop;
GherkinLexerFormatter.prototype.eof = noop.noop;
GherkinLexerFormatter.prototype.tag = noop.noop;

module.exports = GherkinLexerFormatter;
