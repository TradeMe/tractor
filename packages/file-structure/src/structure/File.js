// Dependencies:
import { TractorError } from '@tractor/error-handler';
import fs from 'graceful-fs';
import path from 'path';
import { Directory } from './Directory';
import { pathToUrl } from '../utilities';

export class File {
    constructor (filePath, fileStructure) {
        this.path = path.resolve(process.cwd(), filePath);
        this.fileStructure = fileStructure;

        let isWithinRoot = this.path.indexOf(`${fileStructure.path}${path.sep}`) === 0;

        if (!isWithinRoot) {
            throw new TractorError(`Cannot create "${this.path}" because it is outside of the root of the FileStructure`);
        }

        if (fileStructure.allFilesByPath[this.path]) {
            throw new TractorError(`Cannot create "${this.path}" because it already exists`);
        }

        this.name = path.basename(this.path);
        this.extension = this.extension || path.extname(this.path);
        this.basename = path.basename(this.path, this.extension);

        let relativePath = path.relative(this.fileStructure.path, this.path);
        this.url = pathToUrl(this.fileStructure, relativePath);

        let parentPath = path.dirname(this.path);
        let parent = fileStructure.allDirectoriesByPath[parentPath];
        if (parent) {
            this.directory = parent;
        } else {
            this.directory = new Directory(parentPath, fileStructure);
        }
        this.directory.addItem(this);
    }

    get references () {
        return this.fileStructure.referenceManager.getReferences(this.path);
    }

    get referencedBy () {
        return this.fileStructure.referenceManager.getReferencedBy(this.path);
    }

    addReference (reference) {
        this.fileStructure.referenceManager.addReference(this, reference);
    }

    async cleanup () {
        await this.delete();
        return this.directory.cleanup();
    }

    clearReferences () {
        this.fileStructure.referenceManager.clearReferences(this.path);
        this.fileStructure.referenceManager.clearReferencedBy(this.path);
    }

    async delete (options = { }) {
        let { isMove } = options;

        if (!isMove && this.referencedBy.length) {
            throw new TractorError(`Cannot delete ${this.path} as it is referenced by another file.`);
        }

        try {
            await fs.unlinkAsync(this.path);
            this.directory.removeItem(this);
            this.fileStructure.referenceManager.clearReferences(this.path);    
        } catch {
            throw new TractorError(`Cannot delete ${this.path}. Something went wrong.`);
        }
    }

    async move (update, options = { }) {
        let { isCopy } = options;
        update.oldPath = this.path;

        let newFile = new this.constructor(update.newPath, this.fileStructure);

        options.isMove = true;
        let save = newFile.save(this.buffer, options);

        if (isCopy) {
            return save;
        }

        let { referencedBy, references } = this;
        this.clearReferences();

        let nameChange = {
            oldName: this.basename,
            newName: newFile.basename
        };

        await save;
        await this.delete(options);
        await newFile.refactor('fileNameChange', nameChange);
        try {
            await Promise.all(referencedBy.map(async reference => {
                let { extension } = reference;
                let referenceNameChange = {
                    ...nameChange,
                    extension
                };
                let referencePathChange = {
                    fromPath: reference.path,
                    oldToPath: this.path,
                    newToPath: newFile.path
                };
                reference.addReference(newFile);
                await reference.refactor('referenceNameChange', referenceNameChange);
                return reference.refactor('referencePathChange', referencePathChange);
            }));
            await Promise.all(references.map(async reference => {
                let referencePathChange = {
                    toPath: reference.path,
                    oldFromPath: this.path,
                    newFromPath: newFile.path
                };
                newFile.addReference(reference);
                return newFile.refactor('referencePathChange', referencePathChange);
            }));
        } catch {
            throw new TractorError(`Could not update references after moving ${this.path}.`);
        }
    }

    async read () {
        try {
            let buffer = await fs.readFileAsync(this.path);
            setData.call(this, buffer);
            return this.content;    
        } catch {
            throw new TractorError(`Cannot read ${this.path}. Something went wrong.`);
        }
    }

    async refactor () {
        return Promise.resolve();
    }

    async save (data) {
        await this.directory.save();
        try {
            await fs.writeFileAsync(this.path, data);
            setData.call(this, Buffer.from(data));
            return this.content;
        } catch {
            throw new TractorError(`Cannot save ${this.path}. Something went wrong.`);
        }
    }

    serialise () {
        return this.toJSON();
    }

    toJSON () {
        let references = this.references.map(getFileDetails);
        let referencedBy = this.referencedBy.map(getFileDetails);
        let details = getFileDetails(this);
        return { references, referencedBy, ...details };
    }
}

function getFileDetails (file) {
    let { basename, extension, path, url } = file;
    return { basename, extension, path, url };
}

function setData (data) {
    this.buffer = data;
    this.content = this.buffer.toString();
    this.data = this.content;
}
