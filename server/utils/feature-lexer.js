'use strict';

// Dependencies:
var Formatter = require('./feature-lexer-formatter');
var gherkin = require('gherkin');

// Errors:
var LexFeatureError = require('../errors/LexFeatureError');

module.exports = {
    lex: lex
};

function lex (file) {
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
