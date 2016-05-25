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

    let createDirectories = [
        constants.COMPONENTS,
        constants.FEATURES,
        constants.STEP_DEFINITIONS,
        constants.MOCK_DATA,
        constants.SUPPORT_DIR,
        constants.REPORT_DIR

}