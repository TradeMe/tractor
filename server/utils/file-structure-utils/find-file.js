'use strict';

// Utilities:
var _ = require('lodash');

module.exports = findFile;

function findFile (directory, filePath) {
    return _.find(directory.allFiles, { path: filePath });
}
