// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
import path from 'path';

// Dependencies:
import { Directory } from './Directory';

// Errors:
import { TractorError } from 'tractor-error-handler';

export class File {
    constructor (filePath, fileStructure) {
        this.path = path.resolve(process.cwd(), filePath);
        this.fileStructure = fileStructure;

        let isWithinRoot = this.path.indexOf(`${fileStructure.path}${path.sep}`) === 0;

        if (!isWithinRoot) {
            throw new TractorError(`Cannot create "${this.path}" because it is outside of the root of the FileStructure`);
        }

        this.url = `/${path.relative(this.fileStructure.path, this.path)}`.replace(/\\/, '/');
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

    cleanup () {
        return this.delete()
        .then(() => this.directory.cleanup());
    }

    delete () {
        return fs.unlinkAsync(this.path)
        .then(() => this.directory.removeItem(this));
    }

    move (update, options = { }) {
        let { isCopy } = options;
        update.oldPath = this.path;

        options.isMove = true;
        let newFile = new this.constructor(update.newPath, this.fileStructure);
        return newFile.save(this.buffer, options)
        .then(() => isCopy ? Promise.resolve() : this.delete(options))
        .then(() => newFile);
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
        let { basename, extension, path, url } = this;
        return { basename, extension, path, url };
    }
}
File.prototype.type = '';

function setData (data) {
    this.buffer = data;
    this.content = this.buffer.toString();
    this.data = this.content;
}
