// Constants:
const ALREADY_EXISTS = 'EEXIST';
const DOESNT_EXIST = 'ENOENT';

// Dependencies:
import Promise from 'bluebird';
import fs from 'graceful-fs';
import { info } from 'tractor-logger';

// Errors:
import { TractorError } from 'tractor-error-handler';

export function copyFile (readPath, writePath) {
    return fs.readFileAsync(writePath)
    .then(() => throwExists(writePath))
    .catch(Promise.OperationalError, error => {
        if (error && error.cause && error.cause.code === DOESNT_EXIST) {
            logCreating(writePath);
        } else {
            throw error;
        }
    })
    .then(() => fs.readFileAsync(readPath))
    .then(contents => fs.writeFileAsync(writePath, contents))
    .then(() => logCreated(writePath));
}

export function createDir (directoryPath) {
    logCreating(directoryPath);
    return fs.mkdirAsync(directoryPath)
    .then(() => logCreated(directoryPath))
    .catch(Promise.OperationalError, error => {
        if (error && error.cause && error.cause.code === ALREADY_EXISTS) {
            throwExists(directoryPath);
        } else {
            throw error;
        }
    });
}

function logCreating (path) {
    info(`Creating "${path}"...`);
}

function logCreated (path) {
    info(`"${path}" created.`)
}

function throwExists (path) {
    throw new TractorError(`"${path}" already exists.`);
}
