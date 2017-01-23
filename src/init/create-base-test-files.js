// Constants:
const BASE_FILE_SOURCES = 'base-file-sources';
const HOOKS_FILE_NAME = 'hooks.js';
const PROTRACTOR_CONF_FILE_NAME = 'protractor.conf.js';
const SUPPORT_DIR = 'support';
const WORLD_FILE_NAME = 'world.js';

// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('graceful-fs'));
import path from 'path';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default {
    run: createBaseTestFiles
};

function createBaseTestFiles (testDirectoryPath) {
    let supportDirPath = path.join(testDirectoryPath, SUPPORT_DIR);
    return createFile(WORLD_FILE_NAME, supportDirPath)
    .catch(TractorError, error => logNotCopying(error))
    .then(() => createFile(PROTRACTOR_CONF_FILE_NAME, testDirectoryPath))
    .catch(TractorError, error => logNotCopying(error))
    .then(() => createFile(HOOKS_FILE_NAME, supportDirPath))
    .catch(TractorError, error => logNotCopying(error));
}

function createFile (fileName, directoryPath) {
    let readPath = path.join(__dirname, BASE_FILE_SOURCES, fileName);
    let writePath = path.join(process.cwd(), directoryPath, fileName);
    return fs.openAsync(writePath, 'r')
    .then(() => {
        throw new TractorError(`"${fileName}" already exists.`);
    })
    .catch(Promise.OperationalError, () => console.info(`Creating "${fileName}"...`))
    .then(() => fs.readFileAsync(readPath))
    .then(contents => fs.writeFileAsync(writePath, contents))
    .then(() => console.log(`"${fileName}" created.`));
}

function logNotCopying (error) {
    console.warn(`${error.message} Not copying...`);
}
