// Dependencies:
import { info } from '@tractor/logger';
import { FSWatcher, watch } from 'chokidar';
import { EventEmitter } from 'events';
import * as path from 'path';
import { DOT_FILE_REGEX, EXTENSION_MATCH_REGEX } from '../utilities';
import { Directory } from './directory';
import { File } from './file';
import { Item } from './item';
import { ReferenceManager } from './reference-manager';
import { Structure } from './structure';

// Constants:
const DEFAULT_URL = '/';
const URL_SEPERATOR = '/';
const FILE_STRUCTURE_DELETE_EVENTS = ['unlink', 'unlinkDir'];

export class FileStructure implements Structure {
    public allDirectoriesByPath!: Record<string, Directory | null>;
    public allFilesByPath!: Record<string, File | null>;
    public fileTypes: Record<string, typeof File>;
    public path: string;
    public referenceManager!: ReferenceManager;
    public structure!: Directory;
    public url: string;
    public watcher: EventEmitter | null = null;

    private _ready = false;
    private _watcher: FSWatcher | null = null;

    public constructor (
        fsPath: string,
        url?: string
    ) {
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

    public addFileType (fileConstructor: typeof File): void {
        this.fileTypes[fileConstructor.prototype.extension] = fileConstructor;
    }

    public addItem (item: Item): void {
        const collection: Record<string, Item | null> = item instanceof Directory ? this.allDirectoriesByPath : this.allFilesByPath;
        collection[item.path] = item;
    }

    public getFileConstructor (filePath: string): typeof File | null {
        const fileName = path.basename(filePath);
        const [, fullExtension = ''] = fileName.match(EXTENSION_MATCH_REGEX) || [];
        const extension = path.extname(fileName);
        return this.fileTypes[fullExtension] || this.fileTypes[extension] || null;
    }

    public init (): void {
        this.allFilesByPath = { };
        this.allDirectoriesByPath = { };
        this.structure = new Directory(this.path, this);
        this.referenceManager = new ReferenceManager(this);
    }

    public async read (): Promise<Array<string> | void> {
        return this.structure.read();
    }

    public removeItem (item: Item): void {
        const collection: Record<string, Item | null> = item instanceof Directory ? this.allDirectoriesByPath : this.allFilesByPath;
        collection[item.path] = null;
    }

    public unwatch (): void {
        if (this._watcher) {
            if (this._ready) {
                this._stopWatching();
                return;
            }
            this._watcher.once('ready', () => {
                this._stopWatching();
            });
        }
    }

    public watch (): EventEmitter {
        if (this.watcher) {
            return this.watcher;
        }

        info(`Watching "${this.path}" for changes...`);
        this._ready = false;
        this.watcher = new EventEmitter();
        this._watcher = watch(this.path, {
            ignoreInitial: true,
            ignored: DOT_FILE_REGEX,
            useFsEvents: false
        })
        .on('ready', () => {
            this._ready = true;
            this.watcher!.emit('ready');
        })
        .on('all', async (event: string, itemPath: string) => {
            // Bail out if `unwatch` has been called already;
            if (!this.watcher) {
                return;
            }

            const changeDirectory = itemPath === this.path ? this.structure : this.allDirectoriesByPath[path.dirname(itemPath)];
            // tslint:disable
            console.log(event);
            if (FILE_STRUCTURE_DELETE_EVENTS.includes(event)) {
                const item = this.allDirectoriesByPath[itemPath] || this.allFilesByPath[itemPath];
                if (item) {
                    item.directory!.removeItem(item);
                    info(`"${itemPath} was deleted.`);
                }
            }
            if (changeDirectory) {
                console.log(changeDirectory.path);
                await changeDirectory.read();
                this.watcher.emit('change', changeDirectory);
            }
        });
        return this.watcher;
    }

    private _stopWatching (): void {
        if (this._watcher) {
            this._watcher.close();
        }
        this._watcher = null;
        this.watcher = null;
    }
}
