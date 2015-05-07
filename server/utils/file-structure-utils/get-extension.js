'use strict';

// Utilities:
var _ = require('lodash');
var constants = require('../../constants');
var path = require('path');

module.exports = getExtension;

function getExtension (directoryPath) {
    return _(directoryPath.split(path.sep))
    .map(function (directoryName) {
        var extensionKey = directoryName.toUpperCase() + '_EXTENSION';
        return constants[extensionKey];
    })
    .compact()
    .first();
}
