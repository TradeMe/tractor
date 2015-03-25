'use strict';

// Config:
var config = require('../../utils/get-config')();

// Utilities:
var constants = require('../../constants');
var path = require('path');

// Dependencies:
var esprima = require('esprima');
var fileStructureUtils = require('./file-structure');
var Formatter = require('../../utils/feature-lexer-formatter');
var gherkin = require('gherkin');

// Constants:
var ERROR_MESSAGE = 'Reading file structure failed.';

// Errors:
var ParseJavaScriptError = require('../../errors/ParseJavaScriptError');
var LexFeatureError = require('../../errors/LexFeatureError');

module.exports = createFileStructureHandler();

function createFileStructureHandler () {
    var handler = fileStructureUtils.createModifier(fileStructureUtils.noop, transform, ERROR_MESSAGE);
    return function (request, response) {
        var directoryKey = request.query.directory.toUpperCase() + '_DIR';
        request.body.root = path.join(config.testDirectory, constants[directoryKey]);
        handler(request, response);
    };
}

function transform (fileStructure, request) {
    parse(fileStructure, request);
    lex(fileStructure, request);
    return fileStructure;
}

function parse (fileStructure, request) {
    if (request.query.parse === 'true') {
        fileStructure.allFiles.forEach(function (file) {
            try {
                file.ast = esprima.parse(file.content, {
                    comment: true
                });
            } catch (e) {
                throw new ParseJavaScriptError('Parsing "' + file.name + '" failed.');
            }
        });
    }
}

function lex (fileStructure, request) {
    if (request.query.lex === 'true') {
        fileStructure.allFiles.forEach(function (file) {
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
}
