'use strict';

// Dependencies:
var escodegen = require('escodegen');
var esprima = require('esprima');
var Formatter = require('./feature-lexer-formatter');
var gherkin = require('gherkin');

// Errors:
var GenerateJavaScriptError = require('../Errors/GenerateJavaScriptError');
var ParseJavaScriptError = require('../errors/ParseJavaScriptError');
var LexFeatureError = require('../errors/LexFeatureError');

module.exports = {
    generateJS: generateJS,
    parseJS: parseJS,
    lexFeature: lexFeature
};

function generateJS (file) {
    try {
        file.content = escodegen.generate(file.ast, {
            comment: true
        });
        delete file.ast;
    } catch (e) {
        throw new GenerateJavaScriptError('Generating "' + file.name + ' failed.');
    }
}

function parseJS (file) {
    try {
        file.ast = esprima.parse(file.content, {
            comment: true
        });
        delete file.content;
    } catch (e) {
        throw new ParseJavaScriptError('Parsing "' + file.name + '" failed.');
    }
}

function lexFeature (file) {
    try {
        var formatter = new Formatter();
        /* eslint-disable new-cap */
        var EnLexer = gherkin.Lexer('en');
        /* eslint-enable new-cap */
        var enLexer = new EnLexer(formatter);
        enLexer.scan(file.content);
        file.tokens = formatter.done();
        delete file.content;
    } catch (e) {
        throw new LexFeatureError('Lexing "' + file.name + '" failed.');
    }
}
