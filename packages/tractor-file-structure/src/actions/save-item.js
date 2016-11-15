// Constants:
import CONSTANTS from '../constants';

// Utilities:
import path from 'path';
import { getItemPath, getCopyPath, respondFileStructure } from '../utilities/utilities';

// Dependencies:
import Directory from '../structure/Directory';
import File from '../structure/File'
import { fileStructure } from '../file-structure';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function saveItem (request, response) {
    let { data, overwrite } = request.body;
    let itemPath = getItemPath(request);

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
            let fileName = path.basename(itemPath);
            let [, fullExtension] = fileName.match(CONSTANTS.EXTENSION_MATCH_REGEX);
            let extension = path.extname(fileName);
            let fileConstructor = fileStructure.fileTypes[fullExtension] || fileStructure.fileTypes[extension] || File;

            toSave = new fileConstructor(itemPath, fileStructure);
        }
    }
    return toSave.save(data)
    .then(() => respondFileStructure(response))
    .catch(TractorError, error => tractorErrorHandler.handle(response, error))
    .catch(() => tractorErrorHandler.handle(response, new TractorError(`Could not save "${itemPath}"`)));
}
