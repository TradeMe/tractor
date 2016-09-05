// Utilities:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
import { sep } from 'path';

export default class File {
    constructor (path, directory) {
        this.directory = directory;
        this.path = path;

        let [fileName] = this.path.split(sep).reverse();
        let [name] = fileName.split('.');
        this.name = name;

        this.directory.addFile(this);
    }

    read () {
        return fs.readFileAsync(this.path)
        .then(content => this.content = content.toString());
    }

    save () {
        return fs.writeFileAsync(this.path, this.content)
        .then(() => this.directory.addFile(this));
    }

    delete () {
        return fs.unlinkAsync(this.path)
        .then(() => this.directory.removeFile(this));
    }

    toJSON () {
        let { ast, content, path, name, tokens } = this;
        return { ast, content, path, name, tokens };
    }
}
