// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { copyFile, createDir } from '@tractor/file-structure';
import { warn } from '@tractor/logger';
import Promise from 'bluebird';
import fs from 'graceful-fs';
import path from 'path';

export function init (config) {
    let cucumberSupportDirectoryPath = path.resolve(process.cwd(), config.cucumber.supportDirectory);

    return createDir(cucumberSupportDirectoryPath)
    .catch(TractorError.isTractorError, error => warn(`${error.message} Moving on...`))
    .then(() => copySupportFiles(cucumberSupportDirectoryPath));
}
init['@Inject'] = ['config'];

function copySupportFiles (supportDirectory) {
    let supportFilesDirectory = path.resolve(__dirname, '../support-files');
    return Promise.map(fs.readdirAsync(supportFilesDirectory), file => {
        return copyFile(path.join(supportFilesDirectory, file), path.join(supportDirectory, file))
        .catch(TractorError.isTractorError, error => warn(`${error.message} Not copying...`))
    });
}
