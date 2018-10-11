// Dependencies:
import { Directory } from '../structure/Directory';
import { getCopyPath, respondOkay } from './utilities';
import { urlToPath } from '../utilities';

// Errors:
import { TractorError, handleError } from '@tractor/error-handler';

export function createSaveItemHandler (fileStructure) {
    return async function saveItem (request, response) {
        const { data, overwrite } = request.body;
        const itemUrl = request.params[0];
        let itemPath = urlToPath(fileStructure, itemUrl);

        const file = fileStructure.allFilesByPath[itemPath];
        const directory = fileStructure.allDirectoriesByPath[itemPath];
        const isDirectory = directory || data == null;
        let toSave = file || directory;

        if (toSave && !overwrite) {
            itemPath = getCopyPath(toSave);
            toSave = null;
        }

        if (!toSave) {
            toSave = isDirectory ? new Directory(itemPath, fileStructure) : getNewFile(itemPath, fileStructure);
        }

        if (!toSave) {
            handleError(response, new TractorError(`Could not save "${itemPath}" as it is not a supported file type.`));
        }

        try {
            await toSave.save(data);
            respondOkay(response);
        } catch (error) {
            handleError(response, TractorError.isTractorError(error) ? error : new TractorError(`Could not save "${itemPath}"`));
        }
    };
}

function getNewFile (itemPath, fileStructure) {
    const fileConstructor = fileStructure.getFileConstructor(itemPath);
    if (fileConstructor) {
        return new fileConstructor(itemPath, fileStructure);
    }
    return null;
}
