/* global describe:true, it: true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

var parseJS = require('./parse-js');

describe('server/utils: parse-js:', function () {
    it('should parse a JS file into an AST:', function () {
        var esprima = require('esprima');
        sinon.spy(esprima, 'parse');

        var file = {
            content: 'function foo () { }'
        };
        parseJS(file);

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
        parseJS(file);

        expect(file.content).to.be.undefined();

        esprima.parse.restore();
    });

    it('should throw a `ParseJavaScriptError` if the file is not a valid JavaScript file:', function () {
        var esprima = require('esprima');
        sinon.spy(esprima, 'parse', function () {
            throw new Error();
        });

        var file = {
            name: 'test',
            content: 'Not JavaScript'
        };

        expect(function () {
            parseJS(file);
        }).to.throw('Parsing "test" failed.');

        esprima.parse.restore();
    });
});
