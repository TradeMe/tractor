'use strict';

// Config:
var constants = require('../../constants');

// Utilities:
var _ = require('lodash');

// Dependencies:
var lexFeature = require('./file-structure-utils/lex-feature');
var fileStructureModifier = require('./file-structure-utils/file-structure-modifier');

module.exports = fileStructureModifier.create({
    post: lexFeatures
});

function lexFeatures (fileStructure) {
    _(fileStructure.allFiles).filter(function (file) {
        var extension = constants.FEATURES_EXTENSION.replace(/\./g, '\\.');
        return new RegExp(extension + '$').test(file.path);
    })
    .each(lexFeature).value();
    return fileStructure;
}
