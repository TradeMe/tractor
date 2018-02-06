// Dependencies:
import { getItemPath, respondItemNotFound } from './utilities';

export function createOpenItemHandler (fileStructure) {
    return function openItem (request, response) {
        let itemUrl = request.params[0];
        let itemPath = getItemPath(fileStructure, itemUrl);

        let file = fileStructure.allFilesByPath[itemPath];
        let directory = fileStructure.allDirectoriesByPath[itemPath];

        let item = file || directory;

        if (!item) {
            return respondItemNotFound(itemPath, response);
        }

        response.send(item.serialise());
    }
}
