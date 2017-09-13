// Dependencies:
import { Directory } from '../structure/Directory';
import { getItemPath, getCopyPath, respondOkay } from './utilities';

// Errors:
import { TractorError, handleError } from 'tractor-error-handler';

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
                let fileConstructor = fileStructure.getFileConstructor(itemPath);
                toSave = new fileConstructor(itemPath, fileStructure);
            }
        }
        return toSave.save(data)
        .then(() => respondOkay(response))
        .catch(TractorError.isTractorError, error => handleError(response, error))
        .catch(() => handleError(response, new TractorError(`Could not save "${itemPath}"`)));
    }
}
