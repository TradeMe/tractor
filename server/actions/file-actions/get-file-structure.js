'use strict';

var constants = require('../..//constants');

// Dependencies:
var esprima = require('esprima');
var fileStructureUtils = require('../../utils/file-structure');
var Formatter = require('../../utils/feature-lexer-formatter');
var gherkin = require('gherkin');

// Errors:
var ParseJavaScriptError = require('../../errors/ParseJavaScriptError');
var LexFeatureError = require('../../errors/LexFeatureError');

module.exports = fileStructureUtils.createModifier({
    post: transform
});

function transform (fileStructure) {
    parse(fileStructure);
    lex(fileStructure);
    return fileStructure;
}

function parse (fileStructure) {
    var javaScriptFiles = fileStructure.allFiles.filter(function (file) {
        var extension = constants.JAVASCRIPT_EXTENSION.replace(/\./g, '\\.');
        return new RegExp(extension + '$').test(file.path);
    });
    javaScriptFiles.forEach(function (file) {
        try {
            file.ast = esprima.parse(file.content, {
                comment: true
            });
        } catch (e) {
            throw new ParseJavaScriptError('Parsing "' + file.name + '" failed.');
        }
    });
}

function lex (fileStructure) {
    var featureFiles = fileStructure.allFiles.filter(function (file) {
        var extension = constants.FEATURES_EXTENSION.replace(/\./g, '\\.');
        return new RegExp(extension + '$').test(file.path);
    });
    featureFiles.forEach(function (file) {
        try {
            var formatter = new Formatter();
            /* eslint-disable new-cap */
            var EnLexer = gherkin.Lexer('en');
            /* eslint-enable new-cap */
            var enLexer = new EnLexer(formatter);
            enLexer.scan(file.content);
            file.tokens = formatter.done();
        } catch (e) {
            throw new LexFeatureError('Lexing "' + file.name + '" failed.');
        }
    });
}
