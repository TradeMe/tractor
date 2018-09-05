// Constants:
export const ALREADY_EXISTS = 'EEXIST';
export const DOESNT_EXIST = 'ENOENT';
export const DOT_FILE_REGEX = /(^|[/\\])\../;
export const EXTENSION_MATCH_REGEX = /[^.]*(\..*)?/;

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { info, warn } from '@tractor/logger';
import fs from 'graceful-fs';
import path from 'path';
import { FileStructure } from './structure/FileStructure';

export async function copyFile (readPath, writePath) {
    try {
        await fs.readFileAsync(writePath);
        throwExists(writePath);
    } catch (error) {
        handleDoesntExistError(error, writePath);
    }
    let contents = await fs.readFileAsync(readPath);
    await fs.writeFileAsync(writePath, contents);
    logCreated(writePath);
}

export async function createDir (directoryPath) {
    logCreating(directoryPath);
    try {
        await fs.mkdirAsync(directoryPath);
        logCreated(directoryPath);
    } catch (error) {
        handleExistsError(error, directoryPath);
    }
}

export async function readFiles (directoryPath, fileTypes) {
    const structurePath = path.resolve(process.cwd(), directoryPath);
    const fileStructure = new FileStructure(structurePath);
    fileTypes.forEach(fileType => fileStructure.addFileType(fileType));
    await fileStructure.read();
    return fileStructure;
}

export async function createDirIfMissing (directoryPath) {
    try {
        await createDir(directoryPath);
    } catch (error) {
        handleExistsTractorError(error);
    }
}

export function pathToUrl (fileStructure, itemPath) {
    return path.normalize(`${fileStructure.url}${itemPath}`)
    .replace(/\\/g, '/');
}

export function urlToPath (fileStructure, itemUrl) {
    itemUrl = itemUrl.replace(fileStructure.url, '')
    .replace(/\/$/, '')
    .replace(/\//g, path.sep);

    let cleanUrl = decodeURIComponent(itemUrl);

    return path.join(fileStructure.path, cleanUrl);
}

function logCreating (path) {
    info(`Creating "${path}"...`);
}

function logCreated (path) {
    info(`"${path}" created.`);
}

function handleDoesntExistError (error, path) {
    if (error && error.cause && error.cause.code === DOESNT_EXIST) {
        logCreating(path);
    } else {
        throw error;
    }
}

function handleExistsError (error, path) {
    if (error && error.cause && error.cause.code === ALREADY_EXISTS) {
        throwExists(path);
    } else {
        throw error;
    }
}

function handleExistsTractorError (error) {
    if (TractorError.isTractorError(error)) {
        warn(`${error.message} Moving on...`);
        return;
    }
    throw error;
}

function throwExists (path) {
    throw new TractorError(`"${path}" already exists.`);
}
