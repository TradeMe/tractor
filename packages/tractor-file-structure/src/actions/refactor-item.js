// Utilities:
import { getItemPath, respondOkay, respondItemNotFound } from '../utilities/utilities';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

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
        .catch(TractorError.isTractorError, error => tractorErrorHandler.handle(response, error))
        .catch(() => tractorErrorHandler.handle(response, new TractorError(`Could not refactor "${itemPath}"`)));
    }
}
