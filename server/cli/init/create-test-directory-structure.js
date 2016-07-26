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
        '',
        constants.COMPONENTS,
        constants.FEATURES,
        constants.STEP_DEFINITIONS,
        constants.MOCK_DATA,
        constants.SUPPORT_DIR
    ].map((directory) => createDir(join(testDirectory, directory))
                        .catch(TractorError, (error) => log.warn(`${error.message} Not creating folder structure...`))
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
