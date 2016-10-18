// Constants:
const FILE_NUMBER_REGEX = /\((\d*)\)$/;

// Utilities:
import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';

// Dependencies:
import { Directory, File } from 'tractor-file-structure';
import fileStructure from '../file-structure';
import getFileStructure from './get-file-structure';
import transformers from './transformers';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export default { handler };

function handler (request, response) {
    let { isDirectory } = request.body;
    let { name, oldName, newName } = request.body;
    let { directoryPath, oldDirectoryPath, newDirectoryPath } = request.body;

    return Promise.resolve()
    .then(() => {
        if (isDirectory && oldName && newName) {
            return createUpdateOptions(fileStructure.allDirectoriesByPath, {
                oldName,
                newName,
                oldDirectoryPath: directoryPath,
                newDirectoryPath: directoryPath
            });
        } else if (!isDirectory && oldName && newName) {
            let { extension } = fileStructure.allDirectoriesByPath[directoryPath];
            return createUpdateOptions(fileStructure.allFilesByPath, {
                oldName,
                newName,
                oldDirectoryPath: directoryPath,
                newDirectoryPath: directoryPath,
                extension
            });
        } else if (!isDirectory && oldDirectoryPath && newDirectoryPath) {
            let { extension } = fileStructure.allDirectoriesByPath[oldDirectoryPath];
            return createUpdateOptions(fileStructure.allFilesByPath, {
                oldName: name,
                newName: name,
                oldDirectoryPath,
                newDirectoryPath,
                extension
            });
        } else {
            throw new TractorError('Unknown operation');
        }
    })
    .then(() => getFileStructure.handler(request, response))
    .catch(TractorError, error => tractorErrorHandler.handle(response, error));
}

function createUpdateOptions (collection, options) {
    let { oldName, newName, oldDirectoryPath, newDirectoryPath } = options;
    let extension = options.extension || '';
    let oldPath = path.join(oldDirectoryPath, `${oldName}${extension}`);
    let newPath = path.join(newDirectoryPath, `${newName}${extension}`);
    let item = collection[oldPath];
    let existingItem = collection[newPath];

    while (existingItem) {
        newName = incrementName(newName);
        if (item instanceof File) {
            newPath = path.join(newDirectoryPath, newName + extension);
        } else {
            newPath = path.join(newDirectoryPath, newName);
        }
        existingItem = collection[newPath];
    }

    return updateItem(item, {
        oldName,
        newName,
        oldPath,
        newPath
    });
}

function incrementName (name) {
    let n = _.last(name.match(FILE_NUMBER_REGEX));
    n = +(n + 1 || 1);
    return `${name} (${n})`;
}

function updateItem (item, update) {
    if (item instanceof File) {
        return updateFile(item, update);
    } else {
        return updateDirectory(item, update);
    }
}

function updateFile (toUpdate, update) {
    let newFile = new toUpdate.constructor(update.newPath, fileStructure);

    if (toUpdate.ast) {
        newFile.ast = toUpdate.ast;
    }
    if (toUpdate.content) {
        newFile.content = toUpdate.content;
    }
    if (toUpdate.tokens) {
        newFile.tokens = toUpdate.tokens;
    }

    let { type } = toUpdate.constructor.type;
    return newFile.save(newFile.ast || newFile.tokens || newFile.content)
    .then(() => transformers[type](newFile, update))
    .then(() => toUpdate.delete());
}

function updateDirectory (toUpdate, update) {
    let newDirectory = new Directory(update.newPath, fileStructure);

    return newDirectory.save()
    .then(() => {
        let items = toUpdate.directories.concat(toUpdate.files);
        return Promise.map(items, (item) => {
            let oldPath = item.path;
            let newPath = item.path.replace(update.oldPath, update.newPath);
            let oldName = item.name;
            let newName = item.name;
            return updateItem(item, { oldName, newName, oldPath, newPath });
        });
    })
    .then(() => toUpdate.delete());
}
