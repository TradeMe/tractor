// Utilities:
import path from 'path';

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

    addItem (item) {
        let collection = item instanceof Directory ? this.allDirectoriesByPath : this.allFilesByPath;
        collection[item.path] = item;
    }

    removeItem (item) {
        let collection = item instanceof Directory ? this.allDirectoriesByPath : this.allFilesByPath;
        collection[item.path] = null;
    }

    getFiles (type) {
        return this.structure.getFiles(type);
    }
}
