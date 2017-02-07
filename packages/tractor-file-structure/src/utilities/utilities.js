// Constants:
const EXTENSION_MATCH_REGEX = /[^\.]*(\..*)?/;
const ITEM_NOT_FOUND_STATUS = 404;
const OKAY_STATUS = 200;

// Utilities:
import path from 'path';

// Dependencies:
import Directory from '../structure/Directory';
import File from '../structure/File';
import { fileTypes } from '../file-types';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function getCopyPath (item) {
    let isDirectory = item instanceof Directory;
    let collection = isDirectory ? item.directory.directories : item.directory.files;
    return path.join(item.directory.path, getUniqueName(collection, item));
}

export function getFileConstructorFromFilePath (filePath) {
    let fileName = path.basename(filePath);
    let [, fullExtension] = fileName.match(EXTENSION_MATCH_REGEX);
    let extension = path.extname(fileName);
    return fileTypes[fullExtension] || fileTypes[extension] || File;
}

export function getItemPath (fileStructure, itemUrl) {
    itemUrl = itemUrl
    .replace(/\/$/, '')
    .replace(/\//g, path.sep);

    let cleanUrl = decodeURIComponent(itemUrl);

    return path.resolve(process.cwd(), path.join(fileStructure.path, cleanUrl));
}

export function respondOkay (response) {
    response.sendStatus(OKAY_STATUS);
}

export function respondItemNotFound (itemPath, response) {
    tractorErrorHandler.handle(response, new TractorError(`Could not find "${itemPath}"`, ITEM_NOT_FOUND_STATUS));
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
