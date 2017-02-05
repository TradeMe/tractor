// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
import path from 'path';
import { info } from 'tractor-logger';

// Dependencies:
import Directory from './Directory';
import { extensions, types } from '../file-types';

export default class FileStructure {
    constructor (fsPath) {
        this.path = path.resolve(process.cwd(), fsPath);

        this.fileExtensions = extensions;
        this.fileTypes = types;

        this.init();
    }

    addItem (item) {
        let collection = item instanceof Directory ? this.allDirectoriesByPath : this.allFilesByPath;
        collection[item.path] = item;
    }

    getFiles (type) {
        return this.structure.getFiles(type);
    }

    init () {
        this.allFilesByPath = { };
        this.allDirectoriesByPath = { };
        this.structure = new Directory(this.path, this);
        this.references = { };
    }

    read () {
        return this.structure.read();
    }

    refresh () {
        this.init();
        return this.read();
    }

    removeItem (item) {
        let collection = item instanceof Directory ? this.allDirectoriesByPath : this.allFilesByPath;
        collection[item.path] = null;
    }

    watch () {
        info(`Watching ${this.path} for changes...`);
        return fs.watch(this.path, { recursive: true });
    }
}
