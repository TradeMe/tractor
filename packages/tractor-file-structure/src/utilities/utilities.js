// Constants:
import CONSTANTS from '../constants';

// Utilities:
import path from 'path';

// Dependencies:
import { fileStructure } from '../file-structure';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function getItemPath (request) {
    let url = request.url
    .replace(/^\/fs/, '')
    .replace(/\?.*$/, '')
    .replace(/copy$/, '')
    .replace(/\/$/, '')
    .replace(/\//g, path.sep);

    let cleanUrl = decodeURIComponent(url);

    return path.resolve(process.cwd(), path.join(fileStructure.path, cleanUrl));
}

export function getUniqueName (items, itemName) {
    let name = itemName;
    let n = 1;
    while (nameExists(items, name)) {
        name = `${itemName} (${n})`.trim();
        n += 1;
    }
    return name;
}

function nameExists (items, name) {
    return !!items.find(item => item.name === name);
}

export function respondFileStructure (response) {
    response.send(fileStructure.structure);
}

export function respondItemNotFound (itemPath, response) {
    tractorErrorHandler.handle(response, new TractorError(`Could not find "${itemPath}"`, CONSTANTS.ITEM_NOT_FOUND_ERROR));
}
