// Constants:
export const ALREADY_EXISTS = 'EEXIST';
export const DOESNT_EXIST = 'ENOENT';
export const DOT_FILE_REGEX = /(^|[/\\])\../;
export const EXTENSION_MATCH_REGEX = /[^.]*(\..*)?/;

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { info, warn } from '@tractor/logger';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { promisify } from 'util';
import { File } from './structure/file';
import { FileStructure } from './structure/file-structure';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function copyFile (readPath: string, writePath: string): Promise<void> {
    try {
        await readFile(writePath);
        throwExists(writePath);
    } catch (error) {
        handleDoesntExistError(error as TractorError, writePath);
    }
    const contents = await readFile(readPath);
    await writeFile(writePath, contents);
    logCreated(writePath);
}

export async function createDir (directoryPath: string): Promise<void> {
    logCreating(directoryPath);
    try {
        await mkdir(directoryPath);
        logCreated(directoryPath);
    } catch (error) {
        handleExistsError(error as TractorError, directoryPath);
    }
}

export async function createDirIfMissing (directoryPath: string): Promise<void> {
    try {
        await createDir(directoryPath);
    } catch (error) {
        handleExistsTractorError(error as TractorError);
    }
}

export async function readFiles (directoryPath: string, fileTypes: Array<typeof File>): Promise<FileStructure> {
    const structurePath = path.resolve(process.cwd(), directoryPath);
    const fileStructure = new FileStructure(structurePath);
    fileTypes.forEach(fileType => {
        fileStructure.addFileType(fileType);
    });
    await fileStructure.read();
    return fileStructure;
}

export function pathToUrl (fileStructure: FileStructure, itemPath: string): string {
    return path.normalize(`${fileStructure.url}${itemPath}`)
    .replace(/\\/g, '/');
}

export function urlToPath (fileStructure: FileStructure, itemUrl: string): string {
    const cleanUrl = decodeURIComponent(
        itemUrl.replace(fileStructure.url, '')
        .replace(/\/$/, '')
        .replace(/\//g, path.sep)
    );

    return path.join(fileStructure.path, cleanUrl);
}

function logCreating (creatingPath: string): void {
    info(`Creating "${creatingPath}"...`);
}

function logCreated (createdPath: string): void {
    info(`"${createdPath}" created.`);
}

function handleDoesntExistError (error: NodeJS.ErrnoException, doesntExistPath: string): void {
    if (error && error.code === DOESNT_EXIST) {
        logCreating(doesntExistPath);
    } else {
        throw error;
    }
}

function handleExistsError (error: NodeJS.ErrnoException, existsPath: string): void {
    if (error && error.code === ALREADY_EXISTS) {
        throwExists(existsPath);
    } else {
        throw error;
    }
}

function handleExistsTractorError (error: TractorError): void {
    if (TractorError.isTractorError(error)) {
        warn(`${error.message} Moving on...`);
        return;
    }
    throw error;
}

function throwExists (existsPath: string): void {
    throw new TractorError(`"${existsPath}" already exists.`);
}
