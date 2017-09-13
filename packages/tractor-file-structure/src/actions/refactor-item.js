// Dependencies:
import { getItemPath, respondOkay, respondItemNotFound } from './utilities';

// Errors:
import { TractorError, handleError } from 'tractor-error-handler';

export function createRefactorItemHandler (fileStructure) {
    return function refactorItem (request, response) {
        let { update } = request.body;
        let itemUrl = request.params[0];
        let itemPath = getItemPath(fileStructure, itemUrl);

        let toRefactor = fileStructure.allFilesByPath[itemPath];

        if (!toRefactor) {
            return respondItemNotFound(itemPath, response);
        }

        return toRefactor.refactor(update)
        .then(() => respondOkay(response))
        .catch(TractorError.isTractorError, error => handleError(response, error))
        .catch(() => handleError(response, new TractorError(`Could not refactor "${itemPath}"`)));
    }
}
