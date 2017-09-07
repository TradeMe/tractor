// Constants:
const DIRECTORY_ALREADY_EXISTS = 'EEXIST';

// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('graceful-fs'));
import path from 'path';
import { warn } from 'tractor-logger';
import { getConfig } from './utilities';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default function init (config) {
    let tractorDirectoryPath = config.directory;
    let directory = getConfig(config).directory;

    let relative = path.relative(tractorDirectoryPath, directory);
    return createDir(path.resolve(tractorDirectoryPath, relative))
    .catch(TractorError, error => warn(`${error.message} Moving on...`));
}
init['@Inject'] = ['config'];

function createDir (dir) {
    return fs.mkdirAsync(dir)
    .catch(Promise.OperationalError, error => {
        if (error && error.cause && error.cause.code === DIRECTORY_ALREADY_EXISTS) {
            throw new TractorError(`"${dir}" directory already exists.`);
        } else {
            throw error;
        }
    });
}
