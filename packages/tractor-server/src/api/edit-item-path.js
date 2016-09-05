// Constants:
const FILE_NUMBER_REGEX = /\((\d*)\)$/;

// Utilities:
import _ from 'lodash';
import { join } from 'path';
import Promise from 'bluebird';

// Dependencies:
import Directory from '../file-structure/Directory';
import File from '../files/File';
import fileStructure from '../file-structure';
import getFileStructure from './get-file-structure';
import transformers from './transformers';

// Errors:
import { errorHandler, TractorError } from 'tractor-error-handler';

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
    .catch(TractorError, error => errorHandler.handler(response, error));
}

function createUpdateOptions (collection, options) {
    let { oldName, newName, oldDirectoryPath, newDirectoryPath } = options;
    let extension = options.extension || '';
    let oldPath = join(oldDirectoryPath, `${oldName}${extension}`);
    let newPath = join(newDirectoryPath, `${newName}${extension}`);
    let item = collection[oldPath];
    let existingItem = collection[newPath];
    let directory = fileStructure.allDirectoriesByPath[newDirectoryPath];

    while (existingItem) {
        newName = incrementName(newName);
        if (item instanceof File) {
            newPath = join(newDirectoryPath, newName + extension);
        } else {
            newPath = join(newDirectoryPath, newName);
        }
        existingItem = collection[newPath];
    }

    return updateItem(item, directory, {
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

function updateItem (item, directory, update) {
    if (item instanceof File) {
        return updateFile(item, directory, update);
    } else {
        return updateDirectory(item, directory, update);
    }
}

function updateFile (toUpdate, directory, update) {
    let newFile = new toUpdate.constructor(update.newPath, directory);

    if (toUpdate.ast) {
        newFile.ast = toUpdate.ast;
    }
    if (toUpdate.content) {
        newFile.content = toUpdate.content;
    }
    if (toUpdate.tokens) {
        newFile.tokens = toUpdate.tokens;
    }

    let { type } = toUpdate.directory;
    return newFile.save()
    .then(() => transformers[type](newFile, update))
    .then(() => toUpdate.delete());
}

function updateDirectory (toUpdate, directory, update) {
    let newDirectory = new Directory(update.newPath, directory, fileStructure);

    return newDirectory.save()
    .then(() => {
        let items = toUpdate.directories.concat(toUpdate.files);
        return Promise.map(items, (item) => {
            let oldPath = item.path;
            let newPath = item.path.replace(update.oldPath, update.newPath);
            let oldName = item.name;
            let newName = item.name;
            return updateItem(item, newDirectory, { oldName, newName, oldPath, newPath });
        });
    })
    .then(() => toUpdate.delete());
}
