// Dependencies:
import { Directory } from '../structure/Directory';
import { getCopyPath, respondOkay } from './utilities';
import { urlToPath } from '../utilities';

// Errors:
import { TractorError, handleError } from '@tractor/error-handler';

export function createSaveItemHandler (fileStructure) {
    return async function saveItem (request, response) {
        let { data, overwrite } = request.body;
        let itemUrl = request.params[0];
        let itemPath = urlToPath(fileStructure, itemUrl);

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
        try {
            await toSave.save(data);
            respondOkay(response);
        } catch (error) {
            handleError(response, TractorError.isTractorError(error) ? error : new TractorError(`Could not save "${itemPath}"`));
        }
    };
}
