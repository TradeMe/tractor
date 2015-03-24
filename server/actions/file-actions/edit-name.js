'use strict';

// Dependenices:
var fileStructureUtils = require('./file-structure');

// Constants:
var ERROR_MESSAGE = 'Editing name failed.';

module.exports = fileStructureUtils.createModifier(editName, fileStructureUtils.noop, ERROR_MESSAGE);

function editName (fileStructure, request) {
    var directory = fileStructureUtils.findContainingDirectory(fileStructure, request.body.path);
    var newName = request.body.newName;
    var oldName = request.body.oldName;
    var transforms = request.body.transforms;
    directory[newName] = fileStructureUtils.deletePaths(directory[oldName]);
    if (Array.isArray(transforms)) {
        transforms.forEach(function (transform) {
            var content = directory[newName]['-content'];
            content = content.replace(new RegExp(transform.replace, 'g'), transform.with);
            directory[newName]['-content'] = content;
        });
    }
    delete directory[oldName];
    return fileStructure;
}
