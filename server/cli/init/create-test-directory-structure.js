'use strict';

// Constants:
import constants from '../../constants';

// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
import log from 'npmlog';
import { join } from 'path';


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
        constants.SUPPORT_DIR,
        constants.REPORT_DIR
    ].map((directory) => createDir(join(testDirectory, directory)));
    return Promise.all(createDirectories);
}

function createDir (dir) {
    fs.exists(dir, (exists) => {
        if (exists) {
            log.warn(`"${dir}" directory already exists.`);
        } else {
            log.info(`Creating "${dir}"...`)
            return fs.mkdirAsync(dir)
            .catch(Promise.OperationalError, (error) => {
                throw error;
            });
        }
    })
}
