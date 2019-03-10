// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { promisify } from 'util';
import { ALREADY_EXISTS, EXTENSION_MATCH_REGEX, pathToUrl } from '../utilities';
import { DirectoryMetadata } from './directory-metadata';
import { File } from './file';
import { FileStructure } from './file-structure';
import { Item, ItemDeleteOptions, ItemMoveUpdate } from './item';
import { Structure } from './structure';

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);

export class Directory implements Item, Structure {
    public allDirectories!: Array<Directory>;
    public allFiles!: Array<File>;
    public basename: string;
    public directories!: Array<Directory>;
    public directory?: Directory;
    public files!: Array<File>;
    public name: string;
    public parent: Structure;
    public path: string;
    public url: string;

    private _reading: Promise<Array<string>> | null = null;

    public constructor (
        directoryPath: string,
        public fileStructure: FileStructure
    ) {
        this.path = path.resolve(process.cwd(), directoryPath);
        this.fileStructure = fileStructure;

        const isRoot = this.path === fileStructure.path;
        const isWithinRoot = this.path.indexOf(`${fileStructure.path}${path.sep}`) === 0;

        if (!isRoot && !isWithinRoot)  {
            throw new TractorError(`Cannot create "${this.path}" because it is outside of the root of the FileStructure`);
        }

        if (fileStructure.allDirectoriesByPath[this.path]) {
            throw new TractorError(`Cannot create "${this.path}" because it already exists`);
        }

        this.init();

        this.name = path.basename(this.path);
        this.basename = this.name;

        const relativePath = path.relative(this.fileStructure.path, this.path);
        this.url = pathToUrl(this.fileStructure, relativePath);

        if (isRoot) {
            this.parent = this.fileStructure;
        } else {
            const parentPath = path.dirname(this.path);
            this.directory = fileStructure.allDirectoriesByPath[parentPath] || new Directory(parentPath, fileStructure);
            this.parent = this.directory;
        }
        this.parent.addItem(this);
    }

    public addItem (item: Directory | File): void {
        const itemIsDirectory = item instanceof Directory;
        const collection: Array<Item> = itemIsDirectory ? this.directories : this.files;
        const allCollection: Array<Item> = itemIsDirectory ? this.allDirectories : this.allFiles;

        if (item.directory === this && collection.indexOf(item) === -1) {
            collection.push(item);
        }
        if (allCollection.indexOf(item) === -1) {
            allCollection.push(item);
        }

        this.parent.addItem(item);
    }

    public async cleanup (): Promise<void> {
        try {
            await this.delete();
            if (this.directory) {
                return this.directory.cleanup();
            }
        } catch (error) {
            if (TractorError.isTractorError(error as TractorError)) {
                return;
            }
            throw error;
        }
    }

    public async delete (): Promise<Directory | void> {
        if (!this.directories.length && !this.files.length) {
            try {
                await rmdir(this.path);
                this.parent.removeItem(this);
            } catch {
                throw new TractorError(`Cannot delete "${this.path}". Something went wrong.`);
            }
        } else {
            throw new TractorError(`Cannot delete "${this.path}" because it is not empty`);
        }
    }

    public async exists (): Promise<fs.Stats | null> {
        try {
            return stat(this.path);
        } catch {
            return null;
        }
    }

    public init (): void {
        this.directories = [];
        this.allDirectories = [];
        this.files = [];
        this.allFiles = [];
    }

    public async move (update: ItemMoveUpdate, options: ItemDeleteOptions = { }): Promise<Directory | void> {
        const { isCopy } = options;
        update.oldPath = this.path;

        const directoryConstructor = this.constructor as typeof Directory;
        const newDirectory = new directoryConstructor(update.newPath, this.fileStructure);
        await newDirectory.save();

        const items = ([] as Array<Item>).concat(...this.directories, ...this.files);
        await Promise.all(items.map(async item => {
            const newPath = item.path.replace(update.oldPath!, update.newPath);
            return item.move({ newPath }, options);
        }));

        if (!isCopy) {
            await this.delete();
        }
        return newDirectory;
    }

    public async read (): Promise<Array<string>> {
        try {
            if (this._reading) {
                // tslint:disable
                console.log('already reading', this.path);
                return this._reading;
            }
            // tslint:disable
            console.log('reading', this.path);
            this._reading = readdir(this.path);
            const itemPaths = await this._reading;
            await this._readItems(itemPaths);
            return this._reading;
        } catch (e) {
            // tslint:disable
            console.log('error reading', e);
            throw new TractorError(`Cannot read "${this.path}". Something went wrong.`);
        } finally {
            this._reading = null;
        }
    }

    public removeItem (item: Item): void {
        const itemIsDirectory = item instanceof Directory;
        const collection: Array<Item> = itemIsDirectory ? this.directories : this.files;
        const allCollection: Array<Item> = itemIsDirectory ? this.allDirectories : this.allFiles;

        allCollection.splice(allCollection.indexOf(item), 1);
        if (item.directory === this) {
            collection.splice(collection.indexOf(item), 1);
        }

        this.parent.removeItem(item);
    }

    public async rimraf (): Promise<void> {
        await Promise.all(this.directories.map(async directory => directory.rimraf()));
        await Promise.all(this.files.map(async file => file.delete()));
        await rmdir(this.path);
        this.parent.removeItem(this);
    }

    public async save (): Promise<void> {
        try {
            await stat(this.path);
        } catch (error) {
            if (this.directory) {
                await this.directory.save();
            }
            try {
                await mkdir(this.path);
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== ALREADY_EXISTS) {
                    throw new TractorError(`Cannot save "${this.path}". Something went wrong.`);
                }
            }
        }
    }

    public serialise (): DirectoryMetadata {
        return this.toJSON();
    }

    public toJSON (): DirectoryMetadata {
        const directoryMetadata = this.directories.sort(this._sortNames.bind(this)).map(directory => directory.serialise());
        const fileMetadata = this.files.sort(this._sortNames.bind(this)).map(file => file.toJSON());
        return {
            basename: this.basename,
            directories: directoryMetadata,
            files: fileMetadata,
            isDirectory: true,
            path: this.path,
            url: this.url
        };
    }

    private async _getItemInfo (itemPath: string): Promise<void> {
        const stats = await stat(itemPath);
        if (stats.isDirectory()) {
            const directory = this.fileStructure.allDirectoriesByPath[itemPath] || new Directory(itemPath, this.fileStructure);
            await directory.read();
            return;
        }
        const existingFile = this.fileStructure.allFilesByPath[itemPath];
        if (existingFile) {
            await existingFile.read();
            return;
        }

        const fileConstructor = this.fileStructure.getFileConstructor(itemPath);
        if (fileConstructor) {
            const newFile = new fileConstructor(itemPath, this.fileStructure);
            await newFile.read();
            return;
        }
    }

    private async _readItems (itemPaths: Array<string>): Promise<Array<void>> {
        return Promise.all(itemPaths.filter(itemPath => {
            const [, fullExtension = ''] = (itemPath.match(EXTENSION_MATCH_REGEX) || []);
            return !fullExtension || !!this.fileStructure.fileTypes[fullExtension];
        }).map(async itemPath => this._getItemInfo(path.join(this.path, itemPath))));
    }

    private _sortNames (a: Item, b: Item): 0 | -1 | 1 {
        const aName = a.name;
        const bName = b.name;
        if (aName === bName) {
            return 0;
        } else if (aName > bName) {
            return 1;
        } else {
            return -1;
        }
    }
}
