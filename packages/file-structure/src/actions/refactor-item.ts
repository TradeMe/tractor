// Dependencies:
import { Request, Response } from 'express';
import { FileStructure } from '../structure/file-structure';
import { RefactorData } from '../structure/refactorer';
import { urlToPath } from '../utilities';
import { Action } from './action';
import { respondItemNotFound, respondOkay } from './utilities';

// Errors:
import { handleError, TractorError } from '@tractor/error-handler';

// Types:
export type RefactorItemBody = {
    name: string;
    update: RefactorData;
};
export type RefactorItemParams = Array<string>;

export function createRefactorItemHandler (fileStructure: FileStructure): Action {
    return async function refactorItem (request: Request, response: Response): Promise<void> {
        const { name, update } = request.body as RefactorItemBody;
        const itemUrl = (request.params as RefactorItemParams)[0];
        const itemPath = urlToPath(fileStructure, itemUrl);

        const toRefactor = fileStructure.allFilesByPath[itemPath];

        if (!toRefactor) {
            respondItemNotFound(itemPath, response);
            return;
        }

        try {
            await toRefactor.refactor(name, update);
            respondOkay(response);
        } catch (e) {
            handleError(response, TractorError.isTractorError(e as TractorError) ? e as Error : new TractorError(`Could not refactor "${itemPath}"`));
        }
    };
}
