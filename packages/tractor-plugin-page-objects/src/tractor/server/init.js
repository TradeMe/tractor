// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { createDir } from '@tractor/file-structure';
import { warn } from '@tractor/logger';
import path from 'path';

export function init (config) {
    let pageObjectsDirectoryPath = path.resolve(process.cwd(), config.pageObjects.directory);

    return createDir(pageObjectsDirectoryPath)
    .catch(TractorError.isTractorError, error => warn(`${error.message} Moving on...`));
}
init['@Inject'] = ['config'];
