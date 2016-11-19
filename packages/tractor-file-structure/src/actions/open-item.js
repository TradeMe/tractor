// Utilities:
import { getItemPath, respondItemNotFound } from '../utilities/utilities';

// Dependencies:
import { fileStructure } from '../file-structure';

export function openItem (request, response) {
    let itemUrl = request.params[0];
    let itemPath = getItemPath(itemUrl);

    let file = fileStructure.allFilesByPath[itemPath];
    let directory = fileStructure.allDirectoriesByPath[itemPath];

    if (!file && !directory) {
        return respondItemNotFound(itemPath, response);
    }

    response.send(file ? file.serialise() : directory);
}
