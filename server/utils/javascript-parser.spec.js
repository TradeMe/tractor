/* global describe:true, it: true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

var javascriptParser = require('./javascript-parser');

describe('server/utils: javascript-parser:', function () {
    it('should parse a JS file into an AST:', function () {
        var esprima = require('esprima');
        sinon.spy(esprima, 'parse');

        var file = {
            content: 'function foo () { }'
        };
        javascriptParser.parse(file);

        expect(esprima.parse).to.have.been.calledWith('function foo () { }');
        expect(file.ast).not.to.be.undefined();

        esprima.parse.restore();
    });

    it('should delete the `contents` of the file object once it has been parsed:', function () {
        var esprima = require('esprima');
        sinon.spy(esprima, 'parse');

        var file = {
            content: 'function foo () { }'
        };
        javascriptParser.parse(file);

        expect(file.content).to.be.undefined();

        esprima.parse.restore();
    });

    it('should throw a `ParseJavaScriptError` if the file is not a valid JavaScript file:', function () {
        var file = {
            name: 'test',
            content: 'Not JavaScript'
        };

        expect(function () {
            javascriptParser.parse(file);
        }).to.throw('Parsing "test" failed.');
    });
});
