// Constants:
import CONSTANTS from '../constants';

// Utilities:
import { getItemPath, respondFileStructure, respondItemNotFound } from '../utilities/utilities';

// Dependencies:
import { fileStructure } from '../file-structure';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function refactorItem (request, response) {
    let { update } = request.body;
    let itemUrl = request.params[0];
    let itemPath = getItemPath(itemUrl);

    let toRefactor = fileStructure.allFilesByPath[itemPath];

    if (!toRefactor) {
        return respondItemNotFound(itemPath, response);
    }

    return toRefactor.refactor(update)
    .then(() => respondFileStructure(response))
    .catch(TractorError, error => tractorErrorHandler.handle(response, error))
    .catch(() => tractorErrorHandler.handle(response, new TractorError(`Could not refactor "${itemPath}"`, CONSTANTS.SERVER_ERROR)));
}
