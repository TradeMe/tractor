// Utilities:
import { getItemPath, respondFileStructure, respondItemNotFound } from '../utilities/utilities';

// Dependencies:
import Directory from '../structure/Directory';
import { fileStructure } from '../file-structure';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function deleteItem (request, response) {
    let itemPath = getItemPath(request);
    let { cleanup, rimraf } = request.query;

    let toDelete = fileStructure.allFilesByPath[itemPath] || fileStructure.allDirectoriesByPath[itemPath];
    if (!toDelete) {
        return respondItemNotFound(itemPath, response);
    }

    let operation;
    if (rimraf && toDelete instanceof Directory) {
        operation = toDelete.rimraf();
    } else if (cleanup) {
        operation = toDelete.cleanup();
    } else {
        operation = toDelete.delete();
    }

    return operation
    .then(() => respondFileStructure(response))
    .catch(TractorError, error => tractorErrorHandler.handle(response, error))
    .catch(() => tractorErrorHandler.handle(response, new TractorError(`Could not delete "${itemPath}"`)));
}
