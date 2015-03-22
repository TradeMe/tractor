'use strict';

// Utilities:
var _ = require('lodash');

// Dependenices:
var fileStructure = require('./file-structure');

// Constants:
var ERROR_MESSAGE = 'Editing name failed.';

module.exports = fileStructure.createModifier(editName, ERROR_MESSAGE);

function editName (folderStructure, request) {
    var directory = fileStructure.findContainingDirectory(folderStructure, request.body.path);
    directory[request.body.newName] = deletePaths(directory[request.body.oldName]);
    if (request.body.transform) {
        var transform = request.body.transform;
        var content = directory[request.body.newName]['-content'];
        content = content.replace(new RegExp(transform.replace, 'g'), transform.with);
        directory[request.body.newName]['-content'] = content;
    }
    delete directory[request.body.oldName];
    return folderStructure;
}

function deletePaths (directory) {
    delete directory['-path'];
    _.each(directory, function (item) {
        delete item['-path'];
        if (item['-type'] === 'd') {
            item = deletePaths(item);
        }
    });
    return directory;
}
