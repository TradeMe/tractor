// Constants:
const ITEM_NOT_FOUND_STATUS = 404;
const OKAY_STATUS = 200;

// Dependencies:
import { Response } from 'express';
import * as path from 'path';
import { Directory } from '../structure/directory';
import { File } from '../structure/file';
import { Item } from '../structure/item';

// Errors:
import { handleError, TractorError } from '@tractor/error-handler';

export function getCopyPath (item: Item): string {
    const isDirectory = item instanceof Directory;
    const collection = isDirectory ? item.directory!.directories : item.directory!.files;
    return path.join(item.directory!.path, getUniqueName(collection, item));
}

export function respondItemNotFound (itemPath: string, response: Response): void {
    handleError(response, new TractorError(`Could not find "${itemPath}"`, ITEM_NOT_FOUND_STATUS));
}

function getUniqueName (items: Array<Item>, item: Item): string {
    const extension = (item as File).extension || '';
    let n = 1;
    let uniqueName = item.name;
    while (nameExists(items, uniqueName)) {
        uniqueName = `${item.basename} (${n})${extension}`.trim();
        n += 1;
    }
    return uniqueName;
}

export function respondOkay (response: Response): void {
    response.sendStatus(OKAY_STATUS);
}

function nameExists (items: Array<Item>, name: string): boolean {
    return !!items.find(item => item.name === name);
}
