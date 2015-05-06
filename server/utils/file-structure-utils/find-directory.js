'use strict';

// Utilities:
var _ = require('lodash');

module.exports = findDirectory;

function findDirectory (directory, directoryPath) {
    if (directory.path === directoryPath) {
        return directory;
    }
    var dir;
    _.each(directory.directories, function (directory) {
        if (!dir) {
            if (directory.path === directoryPath) {
                dir = directory;
            } else {
                dir = findDirectory(directory, directoryPath);
            }
        }
    });
    return dir;
}
