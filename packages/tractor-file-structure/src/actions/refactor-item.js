// Dependencies:
import { getItemPath, respondOkay, respondItemNotFound } from './utilities';

// Errors:
import { TractorError, handleError } from '@tractor/error-handler';

export function createRefactorItemHandler (fileStructure) {
    return async function refactorItem (request, response) {
        let { update } = request.body;
        let itemUrl = request.params[0];
        let itemPath = getItemPath(fileStructure, itemUrl);

        let toRefactor = fileStructure.allFilesByPath[itemPath];

        if (!toRefactor) {
            return respondItemNotFound(itemPath, response);
        }

        try {
            await toRefactor.refactor(update);
            respondOkay(response);
        } catch (error) {
            handleError(response, TractorError.isTractorError(error) ? error : new TractorError(`Could not refactor "${itemPath}"`));
        }
    };
}
