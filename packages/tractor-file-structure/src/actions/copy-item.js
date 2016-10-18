// Constants:
import CONSTANTS from '../constants';

// Utilities:
import path from 'path';
import { getItemPath, getUniqueName, respondFileStructure, respondItemNotFound } from '../Utilities/utilities';

// Dependencies:
import { fileStructure } from '../file-structure';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function copyItem (request, response) {
    let itemPath = getItemPath(request);

    let file = fileStructure.allFilesByPath[itemPath];
    let directory = fileStructure.allDirectoriesByPath[itemPath];

    if (!file && !directory) {
        return respondItemNotFound(itemPath, response);
    }

    let copyPath;
    if (file) {
        let copyName = getUniqueName(file.directory.files, file.name);
        copyPath = path.join(file.directory.path, `${copyName}${file.constructor.extension}`);
    } else {
        let copyName = getUniqueName(directory.directory.directories, directory.name);
        copyPath = path.join(directory.directory.path, copyName);
    }
    let toCopy = file || directory;
    let copy = new toCopy.constructor(copyPath, fileStructure);

    return copy.copy(toCopy)
    .then(() => respondFileStructure(response))
    .catch(TractorError, error => tractorErrorHandler.handle(response, error))
    .catch(() => tractorErrorHandler.handle(response, new TractorError(`Could not copy "${itemPath}"`, CONSTANTS.SERVER_ERROR)));
}
