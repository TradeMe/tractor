'use strict';

// Dependencies:
var esprima = require('esprima');

// Errors:
var ParseJavaScriptError = require('../../../errors/ParseJavaScriptError');

module.exports = parseJS;

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
