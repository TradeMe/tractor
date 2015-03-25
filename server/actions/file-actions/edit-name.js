'use strict';

// Utilities:
var path = require('path');

// Dependenices:
var pascal = require('change-case').pascal;
var fileStructureUtils = require('./file-structure');

// Constants:
var ERROR_MESSAGE = 'Editing name failed.';

module.exports = fileStructureUtils.createModifier(editName, fileStructureUtils.noop, ERROR_MESSAGE);

var transformCreators = {
    components: componentTransform,
    feaures: featureTransform
};

function editName (fileStructure, request) {
    var oldName = request.body.oldName;
    var newName = request.body.newName;
    var rootDirectoryName = path.basename(request.body.root);

    var directory = fileStructureUtils.findContainingDirectory(fileStructure, request.body.path);

    var moveFromName;
    var moveToName;
    if (directory[oldName]) {
        moveFromName = oldName;
        moveToName = newName;
    } else {
        var extension = fileStructureUtils.getExtensionFromRoot(rootDirectoryName);
        moveFromName = oldName + extension;
        moveToName = newName + extension;
    }

    directory[moveToName] = fileStructureUtils.deletePaths(directory[moveFromName]);
    delete directory[moveFromName];

    var transformCreator = transformCreators[rootDirectoryName];
    if (transformCreator) {
        var transforms = transformCreator(oldName, newName);
        transforms.forEach(function (transform) {
            var content = directory[newName + extension]['-content'];
            content = content.replace(new RegExp(transform.replace, 'g'), transform.with);
            directory[newName + extension]['-content'] = content;
        });
    }

    return fileStructure;
}

function componentTransform (oldName, newName) {
    var nonalphaquote = '([^a-zA-Z0-9\"])';
    return [{
        replace: nonalphaquote + pascal(oldName) + nonalphaquote,
        with: '$1' + pascal(newName) + '$2'
    }, {
        replace: '\"' + oldName + '\"',
        with: '"' + newName + '"'
    }];
}

function featureTransform (oldName, newName) {
    return [{
        replace: '(\\s)' + oldName + '(\\r\\n|\\n)',
        with: '$1' + newName + '$2'
    }];
}
