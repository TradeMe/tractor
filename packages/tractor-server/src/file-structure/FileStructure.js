'use strict';

// Constants:
import { config } from '../config';

import constants from '../constants';
const NEW_DIRECTORY_NAME = 'New Directory';

// Utilities:
import _ from 'lodash';
import Promise from 'bluebird';
import { join } from 'path';

// Dependencies:
import ComponentFile from '../files/ComponentFile';
import Directory from './Directory';
import files from '../files';
import MockDataFile from '../files/MockDataFile';

// Errors:
import TractorError from '../errors/TractorError';

export default class FileStructure {
    constructor () {
        this.init();
    }

    init () {
        let fileStructurePath = join(process.cwd(), config.testDirectory);

        this.allFiles = [];
        this.allFilesByPath = {};
        this.allDirectories = [];
        this.allDirectoriesByPath = {};
        this.structure = new Directory(fileStructurePath, null, this);
        this.references = {};
    }

    read () {
        return Promise.map(constants.DIRECTORIES, directoryName => {
            let directoryPath = join(this.structure.path, directoryName);
            let directory = new Directory(directoryPath, this.structure, this);
            return directory.read();
        });
    }

    getStructure (type) {
        let directory = this.structure.getDirectory(type);
        let references = this.references;

        let availableComponents;
        let availableMockData;
        if (type === constants.STEP_DEFINITIONS) {
            availableComponents = getFilesOfType.call(this, ComponentFile);
            availableMockData = getFilesOfType.call(this, MockDataFile);
        }

        return { availableComponents, availableMockData, directory, references };
    }

    copyFile (path) {
        let toCopy = this.allFilesByPath[path];
        if (toCopy) {
            let directory = toCopy.directory;
            let copyName = getUniqueName(directory.files, toCopy.name);
            let copyPath = join(directory.path, copyName);
            let copy = new toCopy.constructor(copyPath + directory.extension, directory);

            if (toCopy.ast) {
                let copyAst = _.clone(toCopy.ast, true);
                let [metaComment] = copyAst.comments;
                let meta = JSON.parse(metaComment.value);
                meta.name = copyName;
                metaComment.value = JSON.stringify(meta);
                copy.ast = copyAst;
                return copy.save();
            } else {
                copy.content = toCopy.content;
                return copy.save();
            }
        } else {
            return Promise.reject(new TractorError(`Could not find "${path}"`, constants.FILE_NOT_FOUND_ERROR));
        }
    }

    createDirectory (path) {
        let directory = this.allDirectoriesByPath[path];
        let newDirectoryName = getUniqueName(directory.directories, NEW_DIRECTORY_NAME);
        let newDirectoryPath = join(path, newDirectoryName);
        let newDirectory = new Directory(newDirectoryPath, directory, this);
        return newDirectory.save();
    }

    deleteItem (path) {
        let toDelete = this.allFilesByPath[path] || this.allDirectoriesByPath[path];
        if (toDelete) {
            return toDelete.delete();
        } else {
            return Promise.reject(new TractorError(`Could not find "${path}"`, constants.FILE_NOT_FOUND_ERROR));
        }
    }

    openFile (path) {
        let toOpen = this.allFilesByPath[path];
        if (toOpen) {
            return toOpen.read()
            .then(() => toOpen);
        } else {
            return Promise.reject(new TractorError(`Could not find "${path}"`, constants.FILE_NOT_FOUND_ERROR));
        }
    }

    saveFile (type, data, path) {
        let toSave = this.allFilesByPath[path];
        if (!toSave) {
            let directory = this.structure.getDirectory(type);
            toSave = new files[type](path, directory);
        }
        return toSave.save(data);
    }

    addFile (file) {
        if (!_.includes(this.allFiles, file)) {
            this.allFilesByPath[file.path] = file;
            this.allFiles.push(file);
        }
    }

    removeFile (file) {
        delete this.allFilesByPath[file.path];
        _.remove(this.allFiles, file);
    }

    addDirectory (directory) {
        if (!_.includes(this.allDirectories, directory)) {
            this.allDirectoriesByPath[directory.path] = directory;
            this.allDirectories.push(directory);
        }
    }

    removeDirectory (directory) {
        delete this.allDirectoriesByPath[directory.path];
        _.remove(this.allDirectories, directory);
    }
}

function getFilesOfType (type) {
    return _.filter(this.allFiles, file => file instanceof type);
}

function getUniqueName (items, itemName) {
    let name = '';
    let n = 1;
    do {
        name = `${itemName} (${n})`.trim();
        n += 1;
    } while (nameExists(items, name));
    return name;
}

function nameExists (items, name) {
    return !!_.find(items, item => item.name === name);
}
