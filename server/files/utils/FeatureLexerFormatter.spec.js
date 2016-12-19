/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import dedent from 'dedent';

// Test setup:
const expect = chai.expect;

// Under test:
import FeatureLexerFormatter from './FeatureLexerFormatter';

describe('server/files/utils: FeatureLexerFormatter:', () => {
    describe('FeatureLexerFormatter constructor:', () => {
        it('should return a FeatureLexerFormatter', () => {
            let lexer = new FeatureLexerFormatter();

            expect(lexer).to.be.an.instanceof(FeatureLexerFormatter);
            expect(lexer.features).to.deep.equal([]);
        });

        it('should set a bunch of `noops`', () => {
            let lexer = new FeatureLexerFormatter();

            expect(lexer.comment).to.equal(_.noop);
            expect(lexer.doc_string).to.equal(_.noop);
            expect(lexer.examples).to.equal(_.noop);
            expect(lexer.eof).to.equal(_.noop);
        });
    });

    describe('FeatureLexerFormatter.lastFeature:', () => {
        it('should return the last feature', () => {
            let lexer = new FeatureLexerFormatter();

            let feature1 = {};
            let feature2 = {};
            let feature3 = {};
            lexer.features = [feature1, feature2, feature3];

            expect(lexer.lastFeature).to.equal(feature3);
        });
    });

    describe('FeatureLexerFormatter.lastElement:', () => {
        it('should return the last element', () => {
            let lexer = new FeatureLexerFormatter();

            let element1 = {};
            let element2 = {};
            let element3 = {};
            let feature1 = {};
            let feature2 = {};
            let feature3 = {
                elements: [element1, element2, element3]
            };
            lexer.features = [feature1, feature2, feature3];

            expect(lexer.lastElement).to.equal(element3);
        });
    });

    describe('FeatureLexerFormatter.feature:', () => {
        it('should add a new feature', () => {
            let type = 'type';
            let name = 'name';
            let description = dedent
                             `In order to get something done
                              As a user
                              I want to do something`;

            let lexer = new FeatureLexerFormatter();
            lexer.feature(type, name, description);

            expect(lexer.lastFeature).to.deep.equal({
                type: 'type',
                name: 'name',
                inOrderTo: 'get something done',
                asA: 'user',
                iWant: 'to do something',
                elements: [],
                tag: []
            });
        });
    });

    describe('FeatureLexerFormatter.background:', () => {
        it('should add a new background', () => {
            let type = 'type';
            let name = 'name';
            let description = 'background';
            let feature = { elements: [] };

            let lexer = new FeatureLexerFormatter();
            lexer.features.push(feature);
            lexer.background(type, name, description);

            expect(lexer.lastElement).to.deep.equal({
                type: 'type',
                name: 'name',
                description: 'background',
                examples: [],
                stepDeclarations: []
            });
        });
    });

    describe('FeatureLexerFormatter.scenario:', () => {
        it('should add a new scenario', () => {
            let type = 'type';
            let name = 'name';
            let description = 'scenario';
            let feature = { elements: [] };

            let lexer = new FeatureLexerFormatter();
            lexer.features.push(feature);
            lexer.scenario(type, name, description);

            expect(lexer.lastElement).to.deep.equal({
                type: 'type',
                name: 'name',
                description: 'scenario',
                examples: [],
                stepDeclarations: [],
                tag: []
            });
        });
    });

    describe('FeatureLexerFormatter.scenario_outline:', () => {
        it('should add a new scenario_outline', () => {
            let type = 'type';
            let name = 'name';
            let description = 'scenario_outline';
            let feature = { elements: [] };

            let lexer = new FeatureLexerFormatter();
            lexer.features.push(feature);
            lexer.scenario_outline(type, name, description);

            expect(lexer.lastElement).to.deep.equal({
                type: 'type',
                name: 'name',
                description: 'scenario_outline',
                examples: [],
                stepDeclarations: [],
                tag: []

            });
        });
    });

    describe('FeatureLexerFormatter.row:', () => {
        it('should add a set of variables to an element', () => {
            let element = {};
            let feature = { elements: [element] };

            let lexer = new FeatureLexerFormatter();
            lexer.features.push(feature);
            lexer.row(['variable1', 'variable2']);

            expect(element.variables).to.deep.equal(['variable1', 'variable2']);
        });

        it('should add an example if an element already has variables', () => {
            let element = { examples: [] };
            let feature = { elements: [element] };

            let lexer = new FeatureLexerFormatter();
            lexer.features.push(feature);
            lexer.row(['variable1', 'variable2']);
            lexer.row(['value1', 'value2']);

            let [example] = element.examples;
            expect(example).to.deep.equal(['value1', 'value2']);
        });
    });

    describe('FeatureLexerFormatter.step:', () => {
        it('should add a new step', () => {
            let type = 'type ';
            let step = 'step';
            let element = { stepDeclarations: [] };
            let feature = { elements: [element] };

            let lexer = new FeatureLexerFormatter();
            lexer.features.push(feature);
            lexer.step(type, step);

            let [stepDeclaration] = element.stepDeclarations;
            expect(stepDeclaration).to.deep.equal({
                type: 'type',
                step: 'step'
            });
        });
    });

    describe('FeatureLexerFormatter.done', () => {
        it('should return the features', () => {
            let feature = {};

            let lexer = new FeatureLexerFormatter();
            lexer.features.push(feature);

            expect(lexer.done()).to.deep.equal([feature]);
        });
    });
});
