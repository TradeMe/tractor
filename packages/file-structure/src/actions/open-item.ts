// Dependencies:
import { Request, Response } from 'express';
import { FileStructure } from '../structure/file-structure';
import { urlToPath } from '../utilities';
import { Action } from './action';
import { respondItemNotFound } from './utilities';

// Types:
export type OpenItemParams = Array<string>;

export function createOpenItemHandler (fileStructure: FileStructure): Action {
    return async function openItem (request: Request, response: Response): Promise<void> {
        const itemUrl = (request.params as OpenItemParams)[0];
        const itemPath = urlToPath(fileStructure, itemUrl);

        const file = fileStructure.allFilesByPath[itemPath];
        const directory = fileStructure.allDirectoriesByPath[itemPath];

        const item = file || directory;

        if (!item) {
            respondItemNotFound(itemPath, response);
            return;
        }

        response.send(item.serialise());
    };
}
