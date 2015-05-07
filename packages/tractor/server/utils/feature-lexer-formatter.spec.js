/* global describe:true, it:true */
'use strict';

var chai = require('chai');

var expect = chai.expect;

var FeatureLexerFormatter = require('./feature-lexer-formatter');

describe('server/utils: feature-lexer-formattery:', function () {
    describe('FeatureLexerFormatter::feature', function () {
        it('should extract the important properties out of a feature description', function () {
            var eol = require('os').EOL;
            var formatter = new FeatureLexerFormatter();
            var description = 'In order to do something' + eol +
                              'As a user' + eol +
                              'I want to be able to do something';

            formatter.feature('feature', 'name', description);

            expect(formatter.features.length).to.equal(1);
            expect(formatter.lastFeature.type).to.equal('feature');
            expect(formatter.lastFeature.name).to.equal('name');
            expect(formatter.lastFeature.inOrderTo).to.equal('do something');
            expect(formatter.lastFeature.asA).to.equal('user');
            expect(formatter.lastFeature.iWant).to.equal('to be able to do something');
        });
    });

    describe('FeatureLexerFormatter::background', function () {
        it('should extract the important properties out of a feature background description', function () {
            var formatter = new FeatureLexerFormatter();
            formatter.features = [{
                elements: []
            }];

            formatter.background('background', 'name', 'description');

            expect(formatter.lastFeature.elements.length).to.equal(1);
            expect(formatter.lastElement.type).to.equal('background');
            expect(formatter.lastElement.name).to.equal('name');
            expect(formatter.lastElement.description).to.equal('description');
            expect(formatter.lastElement.examples.length).to.equal(0);
            expect(formatter.lastElement.stepDeclarations.length).to.equal(0);
        });
    });

    describe('FeatureLexerFormatter::scenario', function () {
        it('should extract the important properties out of a feature scenario description', function () {
            var formatter = new FeatureLexerFormatter();
            formatter.features = [{
                elements: []
            }];

            formatter.scenario('scenario', 'name', 'description');

            expect(formatter.lastFeature.elements.length).to.equal(1);
            expect(formatter.lastElement.type).to.equal('scenario');
            expect(formatter.lastElement.name).to.equal('name');
            expect(formatter.lastElement.description).to.equal('description');
            expect(formatter.lastElement.examples.length).to.equal(0);
            expect(formatter.lastElement.stepDeclarations.length).to.equal(0);
        });
    });

    describe('FeatureLexerFormatter::scenario_outline', function () {
        it('should extract the important properties out of a feature scenario_outline description', function () {
            var formatter = new FeatureLexerFormatter();
            formatter.features = [{
                elements: []
            }];

            formatter.scenario_outline('scenario_outline', 'name', 'description');

            expect(formatter.lastFeature.elements.length).to.equal(1);
            expect(formatter.lastElement.type).to.equal('scenario_outline');
            expect(formatter.lastElement.name).to.equal('name');
            expect(formatter.lastElement.description).to.equal('description');
            expect(formatter.lastElement.examples.length).to.equal(0);
            expect(formatter.lastElement.stepDeclarations.length).to.equal(0);
        });
    });

    describe('FeatureLexerFormatter::row', function () {
        it('should extract the variables out of a feature step definition', function () {
            var formatter = new FeatureLexerFormatter();
            formatter.features = [{
                elements: [{}]
            }];

            formatter.row(['a', 'b', 'c']);

            expect(formatter.lastElement.variables.length).to.equal(3);
            expect(formatter.lastElement.variables[0]).to.equal('a');
            expect(formatter.lastElement.variables[1]).to.equal('b');
            expect(formatter.lastElement.variables[2]).to.equal('c');
        });

        it('should extract each example out of a feature step definition', function () {
            var formatter = new FeatureLexerFormatter();
            formatter.features = [{
                elements: [{
                    variables: [],
                    examples: []
                }]
            }];

            formatter.row([1, 2, 3]);

            expect(formatter.lastElement.examples.length).to.equal(1);
            expect(formatter.lastElement.examples[0][0]).to.equal(1);
            expect(formatter.lastElement.examples[0][1]).to.equal(2);
            expect(formatter.lastElement.examples[0][2]).to.equal(3);
        });
    });

    describe('FeatureLexerFormatter::step', function () {
        it('should extract each step declaration out of a scenario', function () {
            var formatter = new FeatureLexerFormatter();
            formatter.features = [{
                elements: [{
                    stepDeclarations: []
                }]
            }];

            var step = /RegExp/;
            formatter.step('step ', step);

            expect(formatter.lastElement.stepDeclarations[0].type).to.equal('step');
            expect(formatter.lastElement.stepDeclarations[0].step).to.equal(step);
        });
    });

    describe('FeatureLexerFormatter::done', function () {
        it('should return all the features', function () {
            var formatter = new FeatureLexerFormatter();
            var features = [];
            formatter.features = features;

            expect(formatter.done()).to.equal(features);
        });
    });
});
