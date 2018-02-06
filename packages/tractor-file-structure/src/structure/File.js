// Dependencies:
import Promise from 'bluebird';
import fs from 'graceful-fs';
import path from 'path';
import { Directory } from './Directory';

// Errors:
import { TractorError } from '@tractor/error-handler';

export class File {
    constructor (filePath, fileStructure) {
        this.path = path.resolve(process.cwd(), filePath);
        this.fileStructure = fileStructure;

        let isWithinRoot = this.path.indexOf(`${fileStructure.path}${path.sep}`) === 0;

        if (!isWithinRoot) {
            throw new TractorError(`Cannot create "${this.path}" because it is outside of the root of the FileStructure`);
        }

        this.url = `/${path.relative(this.fileStructure.path, this.path)}`.replace(/\\/g, '/');
        this.name = path.basename(this.path);
        this.extension = this.extension || path.extname(this.path);
        this.basename = path.basename(this.path, this.extension);

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
        return this.fileStructure.referenceManager.getReferences(this.path)
    }

    get referencedBy () {
        return this.fileStructure.referenceManager.getReferencedBy(this.path)
    }

    addReference (reference) {
        this.fileStructure.referenceManager.addReference(this, reference);
    }

    cleanup () {
        return this.delete()
        .then(() => this.directory.cleanup());
    }

    clearReferences () {
        this.fileStructure.referenceManager.clearReferences(this.path);
        this.fileStructure.referenceManager.clearReferencedBy(this.path);
    }

    delete (options = { }) {
        let { isMove } = options;

        if (!isMove && this.referencedBy.length) {
            return Promise.reject(new TractorError(`Cannot delete ${this.path} as it is referenced by another file.`));
        }

        return fs.unlinkAsync(this.path)
        .then(() => {
            this.directory.removeItem(this);
            this.fileStructure.referenceManager.clearReferences(this.path);
        });
    }

    move (update, options = { }) {
        let { isCopy } = options;
        update.oldPath = this.path;

        let newFile = new this.constructor(update.newPath, this.fileStructure);

        options.isMove = true;
        let save = newFile.save(this.buffer, options);

        if (isCopy) {
            return save;
        }

        let { referencedBy } = this;
        this.clearReferences();

        let nameChange = {
            oldName: this.basename,
            newName: newFile.basename
        };
        return save.then(() => this.delete(options))
        .then(() => newFile.refactor('fileNameChange', nameChange))
        .then(() => {
            return Promise.map(referencedBy, reference => {
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
                return reference.refactor('referenceNameChange', referenceNameChange)
                .then(() => reference.refactor('referencePathChange', referencePathChange));
            })
            .catch(() => {
                throw new TractorError(`Could not update references after moving ${this.path}.`);
            });
        });
    }

    read () {
        return fs.readFileAsync(this.path)
        .then(buffer => setData.call(this, buffer))
        .then(() => this.content);
    }

    refactor () {
        return Promise.resolve();
    }

    save (data) {
        return this.directory.save()
        .then(() => fs.writeFileAsync(this.path, data))
        .then(() => setData.call(this, new Buffer(data)))
        .then(() => this.content);
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
