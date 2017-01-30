// Constants:
const COMPONENTS_DIRECTORY = 'components';
const DIRECTORY_ALREADY_EXISTS = 'EEXIST';
const FEATURES_DIRECTORY = 'features';
const MOCK_DATA_DIRECTORY = 'mock-data';
const REPORT_DIRECTORY = 'report';
const STEP_DEFINITIONS_DIRECTORY = 'step-definitions';
const SUPPORT_DIRECTORY = 'support';

// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('graceful-fs'));
import path from 'path';
import { info, warn } from 'tractor-logger';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default {
    run: createTestDirectoryStructure
};

function createTestDirectoryStructure (testDirectory) {
    info('Creating directory structure...');
    return createAllDirectories(testDirectory);
}

function createAllDirectories (testDirectory) {
    let createDirectories = [
        /* eslint-disable no-warning-comments */
        // TODO: This is a bit cryptic, pull this out into another promise
        // that creates the root dir, and do that first. Otherwise there
        // may be a race condition here?
        '',
        COMPONENTS_DIRECTORY,
        FEATURES_DIRECTORY,
        MOCK_DATA_DIRECTORY,
        REPORT_DIRECTORY,
        STEP_DEFINITIONS_DIRECTORY,
        SUPPORT_DIRECTORY
    ].map(directory => {
        return createDir(path.join(testDirectory, directory))
        .catch(TractorError, error => warn(`${error.message} Moving on...`));
    });

    return Promise.all(createDirectories)
    .then(() => info('Directory structure created.'));
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
