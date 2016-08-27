'use strict';

// Dependencies:
import JavaScriptFile from './JavaScriptFile';

export default class ComponentFile extends JavaScriptFile {
    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }
}

function deleteFileReferences () {
    let { references } = this.directory.fileStructure;

    delete references[this.path];
}
