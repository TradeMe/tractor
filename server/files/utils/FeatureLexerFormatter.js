'use strict';

// Utilities:
import _ from 'lodash';
import os from 'os';

// Constants:
const IN_ORDER_TO = /^In order to /;
const AS_A = /^As a /;
const I_WANT = /^I want /;

export default class FeatureLexerFormatter {
    constructor () {
        this.features = [];

        this.comment = this.doc_string = this.examples = this.eof = this.tag = _.noop;
    }

    get lastFeature () {
        return _.last(this.features);
    }
    get lastElement () {
        return _.last(this.lastFeature.elements);
    }

    feature (type, name, description) {
        let [ inOrderTo, asA, iWant ] = description.split(os.EOL);
        inOrderTo = inOrderTo.replace(IN_ORDER_TO, '');
        asA = asA.replace(AS_A, '');
        iWant = iWant.replace(I_WANT, '');

        let feature = { type, name, inOrderTo, asA, iWant, elements: [] };
        this.features.push(feature);
    }

    background (type, name, description) {
        let background = { type, name, description, examples: [], stepDeclarations: [] };
        this.lastFeature.elements.push(background);
    }

    scenario (type, name, description) {
        let scenario = { type, name, description, examples: [], stepDeclarations: [] };
        this.lastFeature.elements.push(scenario);
    }

    scenario_outline (type, name, description) {
        let scenario_outline = { type, name, description, examples: [], stepDeclarations: [] };
        this.lastFeature.elements.push(scenario_outline);
    }

    row (row) {
        if (!this.lastElement.variables) {
            this.lastElement.variables = row;
        } else {
            this.lastElement.examples.push(row);
        }
    }

    step (type, step) {
        type = type.replace(/ $/, '');
        let stepDeclaration = { type, step };
        this.lastElement.stepDeclarations.push(stepDeclaration);
    }

    done () {
        return this.features;
    }
}
