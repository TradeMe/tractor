// Dependencies:
import { Request, Response } from 'express';
import { Directory } from '../structure/directory';
import { File } from '../structure/file';
import { FileStructure } from '../structure/file-structure';
import { urlToPath } from '../utilities';
import { Action } from './action';
import { getCopyPath, respondOkay } from './utilities';

// Errors:
import { handleError, TractorError } from '@tractor/error-handler';

// Types:
export type SaveItemBody = {
    data?: string | null;
    overwrite?: boolean;
};
export type SaveItemParams = Array<string>;

export function createSaveItemHandler (fileStructure: FileStructure): Action {
    return async function saveItem (request: Request, response: Response): Promise<void> {
        const { data, overwrite } = request.body as SaveItemBody;
        const itemUrl = (request.params as SaveItemParams)[0];
        let itemPath = urlToPath(fileStructure, itemUrl);

        const file = fileStructure.allFilesByPath[itemPath];
        const directory = fileStructure.allDirectoriesByPath[itemPath];
        const isDirectory = directory || data === null || data === undefined;
        let toSave = file || directory;

        if (toSave && !overwrite) {
            itemPath = getCopyPath(toSave);
            toSave = null;
        }

        if (!toSave) {
            toSave = isDirectory ? new Directory(itemPath, fileStructure) : getNewFile(itemPath, fileStructure);
        }

        if (!toSave) {
            handleError(response, new TractorError(`Could not save "${itemPath}" as it is not a supported file type.`));
            return;
        }

        try {
            if (isDirectory) {
                await (toSave as Directory).save();
            } else {
                await (toSave as File).save(data!);
            }
            respondOkay(response);
        } catch (error) {
            handleError(response, TractorError.isTractorError(error as TractorError) ? error as Error : new TractorError(`Could not save "${itemPath}"`));
        }
    };
}

function getNewFile (itemPath: string, fileStructure: FileStructure): File | null {
    const fileConstructor = fileStructure.getFileConstructor(itemPath);
    if (fileConstructor) {
        return new fileConstructor(itemPath, fileStructure);
    }
    return null;
}
