'use strict';

// Utilities:
var path = require('path');

// Dependencies:
var changecase = require('change-case');
var camel = changecase.camel;
var pascal = changecase.pascal;
var fileStructureUtils = require('../../utils/file-structure');

module.exports = fileStructureUtils.createModifier({
    pre: moveFile
});

var transformCreators = {
    '.component.js': componentTransform,
    //'.feature': featureTransform,
    //'.mock.json': mockDataTransform
};

function moveFile (fileStructure, request) {
    debugger;
    var oldName = request.body.oldName || request.body.name;
    var newName = request.body.newName || request.body.name;

    var oldDirectoryPath = request.body.oldDirectoryPath || request.body.directoryPath;
    var newDirectoryPath = request.body.newDirectoryPath || request.body.directoryPath;
    var oldDirectory = fileStructureUtils.findDirectory(fileStructure, oldDirectoryPath);
    var newDirectory = fileStructureUtils.findDirectory(fileStructure, newDirectoryPath);

    var extension = fileStructureUtils.getExtension(oldDirectoryPath);
    var extension = request.body.isDirectory ? '' : extension;

    var moveFromName = oldName + extension;
    var moveToName = newName + extension;

    var oldPath = path.join(oldDirectoryPath, moveFromName);
    var newPath = path.join(newDirectoryPath, moveToName);

    newDirectory[moveToName] = oldDirectory[moveFromName];
    delete oldDirectory[moveFromName];

    var transformCreator = transformCreators[extension];
    if (transformCreator) {
        var fileTransforms = transformCreator(fileStructure, oldName, newName, oldPath, newPath);
        fileTransforms.forEach(function (fileTransform) {
            var file = fileStructureUtils.findFile(fileStructure, fileTransform.path);
            fileTransform.transforms.forEach(function (transform) {
                var content = file['-content'];
                content = content.replace(new RegExp(transform.replace.replace(/\./g, '\\.'), 'g'), transform.with);
                file['-content'] = content;
            });
        });
    }
    fileStructureUtils.deletePaths(newDirectory[moveToName]);
    return fileStructure;
}

function componentTransform (fileStructure, oldName, newName, oldComponentPath, newComponentPath) {
    var nonalphaquote = '([^a-zA-Z0-9\"])';
    var componentUsages = fileStructure.usages[oldComponentPath] || [];
    componentUsages.push(oldComponentPath);
    return componentUsages.map(function (usagePath) {
        return {
            path: usagePath,
            transforms: [{
                replace: nonalphaquote + pascal(oldName) + nonalphaquote,
                with: '$1' + pascal(newName) + '$2'
            }, {
                replace: nonalphaquote + camel(oldName) + nonalphaquote,
                with: '$1' + camel(newName) + '$2'
            }, {
                replace: '\"' + oldName + '\"',
                with: '"' + newName + '"'
            }, {
                replace: path.relative(path.dirname(usagePath), oldComponentPath),
                with: path.relative(path.dirname(usagePath), newComponentPath)
            }]
        };
    });
}

//function featureTransform (oldName, newName) {
//    return Promise.resolve([{
//        replace: '(\\s)' + oldName + '(\\r\\n|\\n)',
//        with: '$1' + newName + '$2'
//    }]);
//}
//
//function mockDataTransform (oldName, newName) {
//    return fileStructureUtils.getFileUsages(config.testDirectory)
//    .then(function () {
//        return [];
//    });
//}
