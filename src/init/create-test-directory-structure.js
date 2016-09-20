// Constants:
import CONSTANTS from '../constants';
const DIRECTORY_ALREADY_EXISTS = 'EEXIST';

// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
import path from 'path';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default {
    run: createTestDirectoryStructure
};

function createTestDirectoryStructure (testDirectory) {
    console.info('Creating directory structure...');
    return createAllDirectories(testDirectory);
}

function createAllDirectories (testDirectory) {
    let createDirectories = [
        // TODO: This is a bit cryptic, pull this out into another promise
        // that creates the root dir, and do that first. Otherwise there
        // may be a race condition here?
        '',
        CONSTANTS.COMPONENTS,
        CONSTANTS.FEATURES,
        CONSTANTS.STEP_DEFINITIONS,
        CONSTANTS.MOCK_DATA,
        CONSTANTS.SUPPORT_DIR,
        CONSTANTS.REPORT_DIR
    ].map(directory => {
        return createDir(path.join(testDirectory, directory))
        .catch(TractorError, error => console.warn(`${error.message} Moving on...`));
    });

    return Promise.all(createDirectories)
    .then(() => console.log('Directory structure created.'));
}

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
