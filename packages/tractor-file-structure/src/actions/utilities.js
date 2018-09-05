// Constants:
const ITEM_NOT_FOUND_STATUS = 404;
const OKAY_STATUS = 200;

// Dependencies:
import path from 'path';
import { Directory } from '../structure/Directory';

// Errors:
import { TractorError, handleError } from '@tractor/error-handler';

export function getCopyPath (item) {
    let isDirectory = item instanceof Directory;
    let collection = isDirectory ? item.directory.directories : item.directory.files;
    return path.join(item.directory.path, getUniqueName(collection, item));
}

export function respondOkay (response) {
    response.sendStatus(OKAY_STATUS);
}

export function respondItemNotFound (itemPath, response) {
    handleError(response, new TractorError(`Could not find "${itemPath}"`, ITEM_NOT_FOUND_STATUS));
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
