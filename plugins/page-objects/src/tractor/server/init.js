// Dependencies:
import { createDirIfMissing } from '@tractor/file-structure';
import path from 'path';

export function init (config) {
    let pageObjectsDirectoryPath = path.resolve(process.cwd(), config.pageObjects.directory);

    return createDirIfMissing(pageObjectsDirectoryPath);
}
init['@Inject'] = ['config'];
