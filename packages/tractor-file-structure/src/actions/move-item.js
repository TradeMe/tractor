// Dependencies:
import { getCopyPath, respondOkay, respondItemNotFound } from './utilities';
import { urlToPath } from '../utilities';

// Errors:
import { TractorError, handleError } from '@tractor/error-handler';

export function createMoveItemHandler (fileStructure) {
    return async function moveItem (request, response) {
        let { copy, newUrl } = request.body;
        let itemUrl = request.params[0];
        let itemPath = urlToPath(fileStructure, itemUrl);

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
            newPath = urlToPath(fileStructure, newUrl);
        }

        try {
            await toMove.move({ newPath }, { isCopy: copy });
            respondOkay(response);
        } catch (error) {
            handleError(response, TractorError.isTractorError(error) ? error : new TractorError(`Could not move "${itemPath}"`));
        }
    };
}
