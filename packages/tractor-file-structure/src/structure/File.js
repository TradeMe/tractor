// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
import path from 'path';

// Dependencies:
import Directory from './Directory';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default class File {
    constructor (filePath, fileStructure) {
        this.path = path.resolve(process.cwd(), filePath);
        this.fileStructure = fileStructure;

        let isWithinRoot = filePath.indexOf(`${fileStructure.path}${path.sep}`) === 0;

        if (!isWithinRoot)  {
            throw new TractorError(`Cannot create "${this.path}" because it is outside of the root of the FileStructure`);
        }

        this.url = `/${path.relative(this.fileStructure.path, this.path)}`.replace(/\\/, '/');
        let [fileName] = this.path.split(path.sep).reverse();
        let [name] = fileName.split('.');
        this.name = name;

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

    copy (toCopy) {
        return this.save(toCopy.buffer);
    }

    delete () {
        return fs.unlinkAsync(this.path)
        .then(() => this.directory.removeItem(this));
    }

    read () {
        return fs.readFileAsync(this.path)
        .then(buffer => setData.call(this, buffer));
    }

    save (data) {
        return this.directory.save()
        .then(() => fs.writeFileAsync(this.path, data))
        .then(() => setData.call(this, new Buffer(data)));
    }

    serialise () {
        return this.toJSON();
    }

    toJSON () {
        let { path, name, url } = this;
        return { path, name, url };
    }
}

function setData (data) {
    this.buffer = data;
    this.content = this.buffer.toString();
    return this.content;
}

File.type = '';
File.extension = '';
