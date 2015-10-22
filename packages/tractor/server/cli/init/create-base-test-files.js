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
    run: createBaseTestFiles
};

function createBaseTestFiles (testDirectoryPath) {
    return createWorldFile(join(testDirectoryPath, constants.SUPPORT_DIR))
    .catch(TractorError, error => logNotCopying(error))
    .then(() => createProtractorConf(testDirectoryPath))
    .catch(TractorError, error => logNotCopying(error));
}

function createWorldFile (supportDirPath) {
    let fileName = constants.WORLD_FILE_NAME;
    let readPath = join(__dirname, constants.WORLD_SOURCE_FILE_PATH);
    let writePath = join(process.cwd(), supportDirPath, constants.WORLD_FILE_NAME);
    return createFile(fileName, readPath, writePath);
}

function createProtractorConf (testDirectoryPath) {
    let fileName = constants.PROTRACTOR_CONF_FILE_NAME;
    let readPath = join(__dirname, constants.PROTRACTOR_CONF_SOURCE_FILE_PATH);
    let writePath = join(process.cwd(), testDirectoryPath, constants.PROTRACTOR_CONF_FILE_NAME);
    return createFile(fileName, readPath, writePath);
}

function createFile (fileName, readPath, writePath) {
    return fs.openAsync(writePath, 'r')
    .then(() => {
        throw new TractorError(`"${fileName}" already exists.`);
    })
    .catch(Promise.OperationalError, () => logCreating(fileName))
    .then(() => fs.readFileAsync(readPath))
    .then(contents => fs.writeFileAsync(writePath, contents))
    .then(() => logCreated(fileName));
}

function logNotCopying (error) {
    log.warn(`${error.message} Not copying...`);
}

function logCreating (file) {
    log.info(`Creating "${file}"...`);
}

function logCreated (file) {
    log.verbose(`"${file}" created.`);
}
