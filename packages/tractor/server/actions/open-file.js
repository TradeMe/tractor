'use strict';

// Config:
var config = require('../utils/get-config');

// Utilities:
var constants = require('../constants');
var log = require('../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var esprima = require('esprima');
var Formatter = require('../utils/gherkin-lexer-formatter');
var fs = Promise.promisifyAll(require('fs'));
var Lexer = require('gherkin').Lexer('en');
var path = require('path');

module.exports = function (folderName, parseJS, lexGherkin) {
    return function (req, res) {
        var extension = constants[folderName.toUpperCase() + '_EXTENSION'];
        var name = decodeURIComponent(req.query.name) + extension;

        return fs.readFileAsync(path.join(config.testDirectory, folderName, name), 'utf-8')
        .then(function (contents) {
            var response = {
                contents: contents
            };
            if (parseJS) {
                response.ast = esprima.parse(contents);
            }
            if (lexGherkin) {
                var formatter = new Formatter();
                var lexer = new Lexer(formatter);
                lexer.scan(contents);
                response.tokens = formatter.done();
            }
            res.send(JSON.stringify(response));
        })
        .catch(function (error) {
            log.error(error);
            res.status(500);
            res.send(JSON.stringify({
                error: 'Reading "' + name + '" failed.'
            }));
        });
    };
};
