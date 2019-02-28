// Dependencies:
import { Request, Response } from 'express';
import { Directory } from '../structure/directory';
import { FileStructure } from '../structure/file-structure';
import { urlToPath } from '../utilities';
import { Action } from './action';
import { respondItemNotFound, respondOkay } from './utilities';

// Errors:
import { handleError, TractorError } from '@tractor/error-handler';

// Types:
export type DeleteItemQueryParams = {
    cleanup: boolean;
    rimraf: boolean;
};
export type DeleteItemParams = Array<string>;

export function createDeleteItemHandler (fileStructure: FileStructure): Action {
    return async function deleteItem (request: Request, response: Response): Promise<void> {
        const { cleanup, rimraf } = request.query as DeleteItemQueryParams;
        const itemUrl = (request.params as DeleteItemParams)[0];
        const itemPath = urlToPath(fileStructure, itemUrl);

        const toDelete = fileStructure.allFilesByPath[itemPath] || fileStructure.allDirectoriesByPath[itemPath];
        if (!toDelete) {
            respondItemNotFound(itemPath, response);
            return;
        }

        try {
            if (rimraf && toDelete instanceof Directory) {
                await toDelete.rimraf();
            } else if (cleanup) {
                await toDelete.cleanup();
            } else {
                await toDelete.delete();
            }

            respondOkay(response);
        } catch (e) {
            handleError(response, TractorError.isTractorError(e as TractorError) ? e as Error : new TractorError(`Could not delete "${itemPath}"`));
        }
    };
}
