// Dependencies:
import { Request, Response } from 'express';
import { FileStructure } from '../structure/file-structure';
import { urlToPath } from '../utilities';
import { Action } from './action';
import { getCopyPath, respondItemNotFound, respondOkay } from './utilities';

// Errors:
import { handleError, TractorError } from '@tractor/error-handler';

// Types:
export type MoveItemBody = {
    copy?: boolean;
    newUrl?: string;
};
export type MoveItemParams = Array<string>;

export function createMoveItemHandler (fileStructure: FileStructure): Action {
    return async function moveItem (request: Request, response: Response): Promise<void> {
        const { copy = false } = request.body as MoveItemBody;
        const { newUrl } = request.body as MoveItemBody;
        const itemUrl = (request.params as MoveItemParams)[0];
        const itemPath = urlToPath(fileStructure, itemUrl);

        const file = fileStructure.allFilesByPath[itemPath];
        const directory = fileStructure.allDirectoriesByPath[itemPath];

        if (!file && !directory) {
            respondItemNotFound(itemPath, response);
            return;
        }

        const toMove = (file || directory)!;

        const newPath = copy ? getCopyPath(toMove) : urlToPath(fileStructure, newUrl!);

        try {
            await toMove.move({ newPath }, { isCopy: copy });
            respondOkay(response);
        } catch (e) {
            handleError(response, TractorError.isTractorError(e as TractorError) ? e as Error : new TractorError(`Could not move "${itemPath}"`));
        }
    };
}
