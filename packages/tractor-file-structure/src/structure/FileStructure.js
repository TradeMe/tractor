// Dependencies:
import { info } from '@tractor/logger';
import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import path from 'path';
import { DOT_FILE_REGEX, EXTENSION_MATCH_REGEX } from '../utilities';
import { Directory } from './Directory';
import { File } from './File';
import { ReferenceManager } from './ReferenceManager';

// Constants:
const DEFAULT_URL = '/';
const URL_SEPERATOR = '/';

export class FileStructure {
    constructor (fsPath, url) {
        this.fileTypes = { };
        this.path = path.resolve(process.cwd(), fsPath);

        this.url = url || DEFAULT_URL;
        if (!this.url.startsWith(URL_SEPERATOR)) {
            this.url = `${URL_SEPERATOR}${this.url}`;
        }
        if (!this.url.endsWith(URL_SEPERATOR)) {
            this.url = `${this.url}${URL_SEPERATOR}`;
        }

        this.init();
    }

    addFileType (fileConstructor) {
        this.fileTypes[fileConstructor.prototype.extension] = fileConstructor;
    }

    addItem (item) {
        let collection = item instanceof Directory ? this.allDirectoriesByPath : this.allFilesByPath;
        collection[item.path] = item;
    }

    getFileConstructor (filePath) {
        let fileName = path.basename(filePath);
        let [, fullExtension] = fileName.match(EXTENSION_MATCH_REGEX);
        let extension = path.extname(fileName);
        return this.fileTypes[fullExtension] || this.fileTypes[extension] || File;
    }

    init () {
        this.allFilesByPath = { };
        this.allDirectoriesByPath = { };
        this.structure = new Directory(this.path, this);
        this.referenceManager = new ReferenceManager(this);
    }

    read () {
        return this.structure.read();
    }

    removeItem (item) {
        let collection = item instanceof Directory ? this.allDirectoriesByPath : this.allFilesByPath;
        collection[item.path] = null;
    }

    watch () {
        info(`Watching ${this.path} for changes...`);
        let watcher = new EventEmitter();
        chokidar.watch(this.path, {
            ignored: DOT_FILE_REGEX,
            ignoreInitial: true,
            awaitWriteFinish: true
        })
        .on('all', (event, itemPath) => {
            let changeDirectory;
            if (itemPath === this.path) {
                changeDirectory = this.structure;
            } else {
                changeDirectory = this.allDirectoriesByPath[path.dirname(itemPath)];
            }
            changeDirectory.refresh()
            .then(() => {
                watcher.emit('change');
            });
        });
        return watcher;
    }
}
