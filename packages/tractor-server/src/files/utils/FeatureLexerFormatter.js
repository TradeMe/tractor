// Constants:
import CONSTANTS from '../../constants';
const IN_ORDER_TO = /^In order to /;
const AS_A = /^As a /;
const I_WANT = /^I want /;

// Utilities:
import _ from 'lodash';

export default class FeatureLexerFormatter {
    constructor () {
        this.features = [];

        /* eslint-disable camelcase */
        this.comment = this.doc_string = this.examples = this.eof = this.tag = _.noop;
        /* eslint-enable camelcase */
    }

    get lastFeature () {
        return _.last(this.features);
    }
    get lastElement () {
        return _.last(this.lastFeature.elements);
    }

    feature (type, name, description) {
        let [inOrderTo, asA, iWant] = description.split(CONSTANTS.FEATURE_NEWLINE);
        inOrderTo = inOrderTo.replace(IN_ORDER_TO, '').replace(/\r/g, '');
        asA = asA.replace(AS_A, '').replace(/\r/g, '');
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

    /* eslint-disable camelcase */
    scenario_outline (type, name, description) {
        let scenario_outline = { type, name, description, examples: [], stepDeclarations: [] };
        this.lastFeature.elements.push(scenario_outline);
    }
    /* eslint-enable camelcase */

    row (row) {
        if (this.lastElement.variables) {
            this.lastElement.examples.push(row);
        } else {
            this.lastElement.variables = row;
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
