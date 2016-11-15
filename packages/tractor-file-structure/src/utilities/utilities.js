// Constants:
import CONSTANTS from '../constants';

// Utilities:
import path from 'path';

// Dependencies:
import Directory from '../structure/Directory';
import { fileStructure } from '../file-structure';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function getCopyPath (item) {
    let isDirectory = item instanceof Directory;
    let collection = isDirectory ? item.directory.directories : item.directory.files;
    return path.join(item.directory.path, getUniqueName(collection, item));
}

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

export function respondFileStructure (response) {
    response.send(fileStructure.structure);
}

export function respondItemNotFound (itemPath, response) {
    tractorErrorHandler.handle(response, new TractorError(`Could not find "${itemPath}"`, CONSTANTS.ITEM_NOT_FOUND_ERROR));
}

function getUniqueName (items, item) {
    let extension = item.extension || '';
    let n = 1;
    let uniqueName = item.name;
    while (nameExists(items, uniqueName)) {
        uniqueName = `${item.basename} (${n})${extension}`.trim();
        n += 1;
    }
    return uniqueName;
}

function nameExists (items, name) {
    return !!items.find(item => item.name === name);
}
