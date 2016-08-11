'use strict';

// Constants:
import constants from '../../constants';

// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
import log from 'npmlog';
import { join } from 'path';

// Errors:
import TractorError from '../../errors/TractorError';

export default {
    run: createTestDirectoryStructure
};

function createTestDirectoryStructure (testDirectory) {
    return createRootDirectory(testDirectory)
    .then(() => createSubDirectories(testDirectory))
    .catch(TractorError, (error) => log.warn(`${error.message} Not creating folder structure...`));
}

function createRootDirectory (testDirectory) {
    log.info('Creating directory structure...');

    return fs.mkdirAsync(testDirectory)
    .catch(Promise.OperationalError, (error) => {
        if (error && error.cause && error.cause.code === 'EEXIST') {
            throw new TractorError(`"${testDirectory}" directory already exists.`);
        } else {
            throw error;
        }
    });
}

function createSubDirectories (testDirectory) {
    let createDirectories = [
        constants.COMPONENTS,
        constants.FEATURES,
        constants.STEP_DEFINITIONS,
        constants.MOCK_DATA,
        constants.SUPPORT_DIR,
        constants.REPORT_DIR
    ].map((directory) => fs.mkdirAsync(join(testDirectory, directory)));

    return Promise.all(createDirectories)
    .then(() => log.verbose('Directory structure created.'));
}
