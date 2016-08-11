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
    log.info('Creating directory structure...');
    return createAllDirectories(testDirectory);
}

function createAllDirectories (testDirectory) {
    let createDirectories = [
        // TODO: This is a bit cryptic, pull this out into another promise
        // that creates the root dir, and do that first. Otherwise there 
        // may be a race condition here?
        '',
        constants.COMPONENTS,
        constants.FEATURES,
        constants.STEP_DEFINITIONS,
        constants.MOCK_DATA,
        constants.SUPPORT_DIR,
        constants.REPORT_DIR
    ].map((directory) => {
        return createDir(join(testDirectory, directory))
            .catch(TractorError, (error) => log.warn(`${error.message} Moving on...`));
    );

    return Promise.all(createDirectories)
    .then(() => log.verbose('Directory structure created.'));
}

function createDir (dir) {
    return fs.mkdirAsync(dir)
    .catch(Promise.OperationalError, (error) => {
        if (error && error.cause && error.cause.code === 'EEXIST') {
            throw new TractorError(`"${dir}" directory already exists.`);
        } else {
            throw error;
        }
    });
}
