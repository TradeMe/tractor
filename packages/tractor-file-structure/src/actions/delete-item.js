// Dependencies:
import { Directory } from '../structure/Directory';
import { getItemPath, respondOkay, respondItemNotFound } from './utilities';

// Errors:
import { TractorError, handleError } from '@tractor/error-handler';

export function createDeleteItemHandler (fileStructure) {
    return async function deleteItem (request, response) {
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

        try {
            await operation;
            respondOkay(response);
        } catch (error) {
            handleError(response, TractorError.isTractorError(error) ? error : new TractorError(`Could not delete "${itemPath}"`));
        }
    };
}
