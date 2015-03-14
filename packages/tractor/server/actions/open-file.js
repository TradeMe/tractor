'use strict';

// Utilities:
var errorHandler = require('../utils/error-handler');
var path = require('path');
var Promise = require('bluebird');

// Config:
var config = require('../utils/get-config')();
var constants = require('../constants');

// Dependencies:
var esprima = require('esprima');
var Formatter = require('../utils/feature-lexer-formatter');
var fs = Promise.promisifyAll(require('fs'));
var gherkin = require('gherkin');

// Errors:
var ParseJavaScriptError = require('../errors/ParseJavaScriptError');
var LexFeatureError = require('../errors/LexFeatureError');

module.exports = createHandlerForDirectory;

function createHandlerForDirectory (directory, options) {
    options = options || {};
    var extension = constants[directory.toUpperCase() + '_EXTENSION'];
    return openFile.bind(null, directory, options, extension);
}

function openFile (directory, options, extension, request, response) {
    var name = decodeURIComponent(request.query.name) + extension;

    return fs.readFileAsync(path.join(config.testDirectory, directory, name), 'utf-8')
    .then(function (contents) {
        var responseData = createResponseData(contents, options, name);
        response.send(JSON.stringify(responseData));
    })
    .catch(ParseJavaScriptError, function (error) {
        errorHandler(response, error);
    })
    .catch(LexFeatureError, function (error) {
        errorHandler(response, error);
    })
    .catch(function (error) {
        var message = 'Reading "' + name + '" failed.';
        errorHandler(response, error, message);
    });
}

function createResponseData (contents, options, name) {
    var data = {
        contents: contents
    };
    if (options.parseJS) {
        data.ast = parseJS(contents, name);
    } else if (options.lexFeature) {
        data.tokens = lexFeature(contents, name);
    }
    return data;
}

function parseJS (contents, name) {
    var ast;
    try {
        ast = esprima.parse(contents);
    } catch (e) {
        throw new ParseJavaScriptError('Parsing "' + name + '" failed.');
    }
    return ast;
}

function lexFeature (contents, name) {
    var tokens;
    try {
        var formatter = new Formatter();
        /* eslint-disable new-cap */
        var EnLexer = gherkin.Lexer('en');
        /* eslint-enable new-cap */
        var enLexer = new EnLexer(formatter);
        enLexer.scan(contents);
        tokens = formatter.done();
    } catch (e) {
        throw new LexFeatureError('Lexing "' + name + '" failed.');
    }
    return tokens;
}
