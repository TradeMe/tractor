// Constants:
import CONSTANTS from '../constants';

// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
import path from 'path';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default {
    run: createBaseTestFiles
};

function createBaseTestFiles (testDirectoryPath) {
    let supportDirPath = path.join(testDirectoryPath, CONSTANTS.SUPPORT_DIR);
    return createWorldFile(supportDirPath)
    .catch(TractorError, error => logNotCopying(error))
    .then(() => createProtractorConf(testDirectoryPath))
    .catch(TractorError, error => logNotCopying(error))
    .then(() => createHooksFile(supportDirPath))
    .catch(TractorError, error => logNotCopying(error));
}

function createWorldFile (supportDirPath) {
    let fileName = CONSTANTS.WORLD_FILE_NAME;
    let readPath = path.join(__dirname, CONSTANTS.WORLD_SOURCE_FILE_PATH);
    let writePath = path.join(process.cwd(), supportDirPath, CONSTANTS.WORLD_FILE_NAME);
    return createFile(fileName, readPath, writePath);
}

function createHooksFile (supportDirPath) {
    let fileName = CONSTANTS.HOOKS_FILE_NAME;
    let readPath = path.join(__dirname, CONSTANTS.HOOKS_SOURCE_FILE_PATH);
    let writePath = path.join(process.cwd(), supportDirPath, CONSTANTS.HOOKS_FILE_NAME);
    return createFile(fileName, readPath, writePath);
}

function createProtractorConf (testDirectoryPath) {
    let fileName = CONSTANTS.PROTRACTOR_CONF_FILE_NAME;
    let readPath = path.join(__dirname, CONSTANTS.PROTRACTOR_CONF_SOURCE_FILE_PATH);
    let writePath = path.join(process.cwd(), testDirectoryPath, CONSTANTS.PROTRACTOR_CONF_FILE_NAME);
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
    console.warn(`${error.message} Not copying...`);
}

function logCreating (file) {
    console.info(`Creating "${file}"...`);
}

function logCreated (file) {
    console.log(`"${file}" created.`);
}
