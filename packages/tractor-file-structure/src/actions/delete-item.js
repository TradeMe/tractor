// Dependencies:
import { Directory } from '../structure/Directory';
import { getItemPath, respondOkay, respondItemNotFound } from './utilities';

// Errors:
import { TractorError, handleError } from 'tractor-error-handler';

export function createDeleteItemHandler (fileStructure) {
    return function deleteItem (request, response) {
        let { cleanup, rimraf } = request.query;
        let itemUrl = request.params[0];
        let itemPath = getItemPath(fileStructure, itemUrl);

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
        .then(() => respondOkay(response))
        .catch(TractorError.isTractorError, error => handleError(response, error))
        .catch(() => handleError(response, new TractorError(`Could not delete "${itemPath}"`)));
    }
}
