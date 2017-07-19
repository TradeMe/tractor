// Constants:
const DIRECTORY_ALREADY_EXISTS = 'EEXIST';
const REPORT_DIRECTORY = 'report';
const SUPPORT_DIRECTORY = 'support';

// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('graceful-fs'));
import path from 'path';
import { info, warn } from 'tractor-logger';

// Errors:
import { TractorError } from 'tractor-error-handler';

export function createTractorDirectoryStructure (config) {
    info('Creating directory structure...');
    return createAllDirectories(config);
}
createTractorDirectoryStructure['@Inject'] = ['config'];

function createAllDirectories (config) {
    let tractorDirectoryPath = config.directory;

    return createDir(tractorDirectoryPath)
    .then(() => {
        return Promise.map([
            REPORT_DIRECTORY,
            SUPPORT_DIRECTORY
        ], directory => {
            return createDir(path.join(tractorDirectoryPath, directory))
        });
    })
    .then(() => {
        return Promise.map([
            config.features.directory,
            config.pageObjects.directory,
            config.stepDefinitions.directory,
        ], directory => {
            let relative = path.relative(tractorDirectoryPath, directory);
            return createDir(path.resolve(tractorDirectoryPath, relative));
        });
    })
    .then(() => info('Directory structure created.'))
    .catch(TractorError, error => warn(`${error.message} Moving on...`));
}

function createDir (dir) {
    return fs.mkdirAsync(path.relative('.', dir))
    .catch(Promise.OperationalError, error => {
        if (error && error.cause && error.cause.code === DIRECTORY_ALREADY_EXISTS) {
            throw new TractorError(`"${dir}" directory already exists.`);
        } else {
            throw error;
        }
    });
}
