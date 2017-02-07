// Utilities:
import { getFileConstructorFromFilePath, getItemPath, getCopyPath, respondOkay } from '../utilities/utilities';

// Dependencies:
import Directory from '../structure/Directory';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function createSaveItemHandler (fileStructure) {
    return function saveItem (request, response) {
        let { data, overwrite } = request.body;
        let itemUrl = request.params[0];
        let itemPath = getItemPath(fileStructure, itemUrl);

        let file = fileStructure.allFilesByPath[itemPath];
        let directory = fileStructure.allDirectoriesByPath[itemPath];
        let toSave = file || directory;
        let isDirectory = directory || data == null;

        if (toSave && !overwrite) {
            itemPath = getCopyPath(toSave);
            toSave = null;
        }

        if (!toSave) {
            if (isDirectory) {
                toSave = new Directory(itemPath, fileStructure);
            } else {
                let fileConstructor = getFileConstructorFromFilePath(itemPath);
                toSave = new fileConstructor(itemPath, fileStructure);
            }
        }
        return toSave.save(data)
        .then(() => respondOkay(response))
        .catch(TractorError.isTractorError, error => tractorErrorHandler.handle(response, error))
        .catch(() => tractorErrorHandler.handle(response, new TractorError(`Could not save "${itemPath}"`)));
    }
}
