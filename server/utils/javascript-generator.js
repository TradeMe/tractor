'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
var escodegen = require('escodegen');

// Errors:
var GenerateJavaScriptError = require('../Errors/GenerateJavaScriptError');

module.exports = {
    generate: generate
};

var LEADING_SLASH_REGEX = /^\//;
var TRAILING_SLASH_REGEX = /(\/)[gimuy]*?$/;
var REGEXP_CONTENT_REGEX = /^\/.*\/[gimuy]*?$/;
var REGEXP_FLAGS_REGEX = /([gimuy]*)$/;

function generate (file) {
    try {
        file.ast.leadingComments = file.ast.comments;
        file.content = escodegen.generate(rebuildRegExps(file.ast), {
            comment: true
        });
        delete file.ast;
    } catch (error) {
        throw new GenerateJavaScriptError('Generating "' + file.name + '" failed.');
    }
}

function rebuildRegExps (object) {
    _.each(object, function (value) {
        if (value && isRegexLiteral(value)) {
            var regexContent = value.raw
            .replace(LEADING_SLASH_REGEX, '')
            .replace(TRAILING_SLASH_REGEX, '');
            var regexFlags = _.first(REGEXP_FLAGS_REGEX.exec(value.raw));
            value.value = new RegExp(regexContent, regexFlags);
        } else if (_.isArray(value) || _.isObject(value)) {
            rebuildRegExps(value);
        }
    });
    return object;
}

function isRegexLiteral (object) {
    return object.type === 'Literal' && object.raw && REGEXP_CONTENT_REGEX.test(object.raw);
}
