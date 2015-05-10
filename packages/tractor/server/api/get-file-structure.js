'use strict';

// Config:
var constants = require('../constants');

// Utilities:
var _ = require('lodash');

// Dependencies:
var featureLexer = require('../utils/feature-lexer');
var fileStructureModifier = require('../utils/file-structure-modifier');

var featureExtension = constants.FEATURES_EXTENSION.replace(/\./g, '\\.');
var FEATURE_EXTENSION_REGEX = new RegExp(featureExtension + '$');

module.exports = init;

function init () {
    return fileStructureModifier.create({
        preSend: lexFeatures
    });
}

function lexFeatures (fileStructure) {
    _(fileStructure.allFiles)
    .filter(function (file) {
        return FEATURE_EXTENSION_REGEX.test(file.path);
    })
    .each(featureLexer.lex)
    .value();
    return fileStructure;
}
