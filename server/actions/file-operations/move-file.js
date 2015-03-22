'use strict';

// Utilities:
var _ = require('lodash');

// Dependenices:
var fileStructure = require('./file-structure');

// Constants:
var ERROR_MESSAGE = 'Moving file failed.';

module.exports = fileStructure.createModifier(moveFile, ERROR_MESSAGE);

function moveFile (directories, request) {
    return directories;
}
