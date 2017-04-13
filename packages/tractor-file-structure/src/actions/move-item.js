// Utilities:
import { getCopyPath, getItemPath, respondOkay, respondItemNotFound } from '../utilities/utilities';

// Errors:
import { TractorError, handleError } from 'tractor-error-handler';

export function createMoveItemHandler (fileStructure) {
    return function moveItem (request, response) {
        let { copy, newUrl } = request.body;
        let itemUrl = request.params[0];
        let itemPath = getItemPath(fileStructure, itemUrl);

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
            newPath = getItemPath(fileStructure, newUrl);
        }

        return toMove.move({ newPath }, { isCopy: copy })
        .then(() => respondOkay(response))
        .catch(TractorError.isTractorError, error => handleError(response, error))
        .catch(() => handleError(response, new TractorError(`Could not move "${itemPath}"`)));
    }
}
createMoveItemHandler['@Inject'] = ['fileStructure'];
