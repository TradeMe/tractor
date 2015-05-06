'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');

// Dependencies:
var fileStructureModifier = require('../utils/file-structure-modifier');
var fileStructureUtils = require('../utils/file-structure-utils/file-structure-utils');

module.exports = init;

function init () {
    return fileStructureModifier.create({
        preSave: deleteItem
    });
}

function deleteItem (fileStructure, request) {
    var query = request.query;
    var name = query.name;
    var filePath = query.path;
    var isDirectory = !!query.isDirectory;

    var directory = fileStructureUtils.findDirectory(fileStructure, path.dirname(filePath));
    _.remove(isDirectory ? directory.directories : directory.files, itemNameEquals(name));
    return fileStructure;
}

function itemNameEquals (name) {
    return function (item) {
        return item.name === name;
    };
}
