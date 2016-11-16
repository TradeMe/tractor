// Utilities:
import { getItemPath, respondItemNotFound } from '../utilities/utilities';

// Dependencies:
import { fileStructure } from '../file-structure';

export function openItem (request, response) {
    let itemPath = getItemPath(request);

    let file = fileStructure.allFilesByPath[itemPath];
    let directory = fileStructure.allDirectoriesByPath[itemPath];

    if (!file && !directory) {
        return respondItemNotFound(itemPath, response);
    }

    response.send(file ? file.serialise() : directory);
}
