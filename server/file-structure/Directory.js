'use strict';

// Constants:
import constants from '../constants';

// Utilities:
import _ from 'lodash';
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('graceful-fs'));
import { join, sep } from 'path';

// Dependencies:
import files from '../files';

export default class Directory {
    constructor (path, directory, fileStructure) {
        this.fileStructure = fileStructure;
        this.directory = directory;
        this.path = path;

        this.directories = [];
        this.files = [];
        let [directoryName] = this.path.split(sep).reverse();
        this.name = directoryName;

        if (this.directory) {
            this.type = directory.type || this.name;
            this.extension = directory.extension || constants.EXTENSIONS[this.type];
            this.directory.addDirectory(this);
        } else {
            this.fileStructure.addDirectory(this);
        }
    }

    read () {
        return fs.readdirAsync(this.path)
        .then((itemPaths) => readItems.call(this, itemPaths));
    }

    save () {
        return Promise.map(this.directories, directory => directory.save())
        .then(() => Promise.map(this.files, file => file.save()))
        .then(() => fs.mkdirAsync(this.path))
        .then(() => this.directory.addDirectory(this));
    }

    delete () {
        return Promise.map(this.directories, directory => directory.delete())
        .then(() => Promise.map(this.files, file => file.delete()))
        .then(() => fs.rmdirAsync(this.path))
        .then(() => this.directory.removeDirectory(this));
    }

    addFile (file) {
        if (!_.contains(this.files, file)) {
            this.files.push(file);
        }
        this.fileStructure.addFile(file);
    }

    removeFile (file) {
        _.remove(this.files, file);
        this.fileStructure.removeFile(file);
    }

    addDirectory (directory) {
        if (!_.contains(this.directories, directory)) {
            this.directories.push(directory);
        }
        this.fileStructure.addDirectory(directory);
    }

    removeDirectory (directory) {
        _.remove(this.directories, directory);
        this.fileStructure.removeDirectory(directory);
    }

    getDirectory (name) {
        return _.find(this.directories, directory => directory.name === name);
    }

    toJSON () {
        let { directories, files, name, path } = this;
        directories = _.sortBy(directories, 'name');
        files = _.sortBy(files, 'name');
        return { directories, files, name, path, isDirectory: true };
    }
}

function readItems (itemPaths) {
    return Promise.map(itemPaths, (itemPath) => {
        return getItemInfo.call(this, join(this.path, itemPath));
    });
}

function getItemInfo (itemPath) {
    return fs.statAsync(itemPath)
    .then(stat => handleItem.call(this, itemPath, stat));
}

function handleItem (itemPath, stat) {
    if (stat.isDirectory()) {
        let directory = new Directory(itemPath, this, this.fileStructure);
        return directory.read();
    } else {
        let file = new files[this.type](itemPath, this);
        return file.read();
    }
}
