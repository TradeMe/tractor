/* global describe:true, it: true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var noop = require('node-noop').noop;
var expect = chai.expect;
chai.use(sinonChai);

var featureLexer = require('./feature-lexer');

describe('server/utils: lex-feature:', function () {
    it('should lex a feature file into tokens:', function () {
        var gherkin = require('gherkin');
        var Formatter = require('./feature-lexer-formatter');

        var lexer = {
            scan: noop
        };

        sinon.stub(gherkin, 'Lexer').returns(function () {
            this.scan = lexer.scan;
        });

        sinon.spy(lexer, 'scan');
        sinon.spy(Formatter.prototype, 'done');

        var file = {
            content: 'Feature Some Test Feature'
        };
        featureLexer.lex(file);

        expect(lexer.scan).to.have.been.calledWith('Feature Some Test Feature');
        expect(Formatter.prototype.done.callCount).to.equal(1);
        expect(file.tokens).not.to.be.undefined();

        gherkin.Lexer.restore();
        Formatter.prototype.done.restore();
    });

    it('should delete the `contents` of the file object once it has been lexed:', function () {
        var gherkin = require('gherkin');

        var lexer = {
            scan: noop
        };

        sinon.stub(gherkin, 'Lexer').returns(function () {
            this.scan = lexer.scan;
        });

        var file = {
            content: 'Feature Some Test Feature'
        };
        featureLexer.lex(file);

        expect(file.content).to.be.undefined();

        gherkin.Lexer.restore();
    });

    it('should throw a `LexFeatureError` if the file is not a valid Feature file:', function () {
        var gherkin = require('gherkin');

        var lexer = {
            scan: function () {
                throw new Error();
            }
        };

        sinon.stub(gherkin, 'Lexer').returns(function () {
            this.scan = lexer.scan;
        });

        var file = {
            name: 'test',
            content: 'Not JavaScript'
        };

        expect(function () {
            featureLexer.lex(file);
        }).to.throw('Lexing "test" failed.');

        gherkin.Lexer.restore();
    });
});
