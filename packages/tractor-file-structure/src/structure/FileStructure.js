// Constants:
const DOT_FILE_REGEX = /(^|[\/\\])\../;

// Utilities:
import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import path from 'path';
import { info } from 'tractor-logger';

// Dependencies:
import { Directory } from './Directory';

export class FileStructure {
    constructor (fsPath) {
        this.path = path.resolve(process.cwd(), fsPath);

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
            let changeDirectory = this.allDirectoriesByPath[path.dirname(itemPath)];
            if (changeDirectory) {
                changeDirectory.refresh()
                .then(() => {
                    watcher.emit('change');
                });
            }
        });
        return watcher;
    }
}
