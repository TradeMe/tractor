// Dependencies:
import { TractorError } from '@tractor/error-handler';
import fs from 'graceful-fs';
import path from 'path';
import { pathToUrl, ALREADY_EXISTS, EXTENSION_MATCH_REGEX } from '../utilities';

export class Directory {
    constructor (directoryPath, fileStructure) {
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

    addItem (item) {
        const itemIsDirectory = item instanceof Directory;
        const collection = itemIsDirectory ? this.directories : this.files;
        const allCollection = itemIsDirectory ? this.allDirectories : this.allFiles;

        if (item.directory === this && collection.indexOf(item) === -1) {
            collection.push(item);
        }
        if (allCollection.indexOf(item) === -1) {
            allCollection.push(item);
        }

        this.parent.addItem(item);
    }

    async cleanup () {
        try {
            await this.delete();
            if (this.directory) {
                return this.directory.cleanup();
            }
        } catch (error) {
            if (TractorError.isTractorError(error)) {
                return;
            }
            throw error;
        }
    }

    async delete () {
        if (!this.directories.length && !this.files.length) {
            try {
                await fs.rmdirAsync(this.path);
                this.parent.removeItem(this);
            } catch {
                throw new TractorError(`Cannot delete "${this.path}". Something went wrong.`);
            }
        } else {
            throw new TractorError(`Cannot delete "${this.path}" because it is not empty`);
        }
    }

    init () {
        this.directories = [];
        this.allDirectories = [];
        this.files = [];
        this.allFiles = [];
    }

    async move (update, options = { }) {
        const { isCopy } = options;
        update.oldPath = this.path;

        const newDirectory = new this.constructor(update.newPath, this.fileStructure);
        await newDirectory.save();

        const items = this.directories.concat(this.files);
        await Promise.all(items.map(item => {
            const newPath = item.path.replace(update.oldPath, update.newPath);
            return item.move({ newPath }, options);
        }));
        await isCopy ? null : this.delete();
        return newDirectory;
    }

    async read () {
        if (this.reading) {
            return this.reading;
        }
        try {
            this.reading = fs.readdirAsync(this.path);
            let itemPaths = await this.reading;
            await readItems.call(this, itemPaths);
        } catch {
            throw new TractorError(`Cannot read "${this.path}". Something went wrong.`);
        } finally {
            this.reading = null;
        }
    }

    removeItem (item) {
        const itemIsDirectory = item instanceof Directory;
        const collection = itemIsDirectory ? this.directories : this.files;
        const allCollection = itemIsDirectory ? this.allDirectories : this.allFiles;

        const removeIndex = allCollection.indexOf(item);
        allCollection.splice(removeIndex, 1);
        if (item.directory === this) {
            const removeIndex = collection.indexOf(item);
            collection.splice(removeIndex, 1);
        }

        this.parent.removeItem(item);
    }

    async rimraf () {
        await Promise.all(this.directories.map(directory => directory.rimraf()));
        await Promise.all(this.files.map(file => file.delete()));
        await fs.rmdirAsync(this.path);
        this.parent.removeItem(this);
    }

    async save () {
        try {
            await fs.statAsync(this.path);
        } catch (error) {
            if (this.directory) {
                await this.directory.save();
                try {
                    await fs.mkdirAsync(this.path);
                } catch (e) {
                    if (e.code != ALREADY_EXISTS) {
                        throw new TractorError(`Cannot save "${this.path}". Something went wrong.`);
                    }
                }
            }
        }
    }

    serialise () {
        return this.toJSON();
    }

    toJSON () {
        let { basename, directories, files, path, url } = this;
        directories = directories.sort(sortNames).map(directory => directory.serialise());
        files = files.sort(sortNames).map(file => file.toJSON());
        return { basename, directories, files, isDirectory: true, path, url };
    }
}

async function getItemInfo (itemPath) {
    const stat = await fs.statAsync(itemPath);
    return handleItem.call(this, itemPath, stat);
}

function handleItem (itemPath, stat) {
    if (stat.isDirectory()) {
        const directory = this.fileStructure.allDirectoriesByPath[itemPath] || new this.constructor(itemPath, this.fileStructure);
        return directory.read();
    } else {
        const existingFile = this.fileStructure.allFilesByPath[itemPath];
        if (existingFile) {
            return existingFile.read();
        }

        const fileConstructor = this.fileStructure.getFileConstructor(itemPath);
        if (fileConstructor) {
            const newFile = new fileConstructor(itemPath, this.fileStructure);
            return newFile.read();
        }
    }
}

function readItems (itemPaths) {
    return Promise.all(itemPaths.filter(itemPath => {
        const [, fullExtension] = itemPath.match(EXTENSION_MATCH_REGEX);
        return !fullExtension || !!this.fileStructure.fileTypes[fullExtension];
    }).map(itemPath => getItemInfo.call(this, path.join(this.path, itemPath))));
}

function sortNames (a, b) {
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
