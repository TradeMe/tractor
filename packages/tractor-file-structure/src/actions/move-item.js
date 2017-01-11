// Constants:
import CONSTANTS from '../constants';

// Utilities:
import { getCopyPath, getItemPath, respondFileStructure, respondItemNotFound } from '../utilities/utilities';

// Dependencies:
import { fileStructure } from '../file-structure';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function moveItem (request, response) {
    let { copy, newUrl } = request.body;
    let itemUrl = request.params[0];
    let itemPath = getItemPath(itemUrl);

    let file = fileStructure.allFilesByPath[itemPath];
    let directory = fileStructure.allDirectoriesByPath[itemPath];

    if (!file && !directory) {
        return respondItemNotFound(itemPath, response);
    }

    let toMove = file || directory;

    copy = copy || false;
    let newPath;
    if (copy) {
        newPath = getCopyPath(toMove);
    } else {
        newPath = getItemPath(newUrl);
    }

    return toMove.move({ newPath }, { isCopy: copy })
    .then(() => respondFileStructure(response))
    .catch(TractorError.isTractorError, error => tractorErrorHandler.handle(response, error))
    .catch(() => tractorErrorHandler.handle(response, new TractorError(`Could not move "${itemPath}"`, CONSTANTS.SERVER_ERROR)));
}
