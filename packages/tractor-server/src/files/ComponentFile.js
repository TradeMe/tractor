// Dependencies:
import JavaScriptFile from './JavaScriptFile';
import tractorFileStructure from 'tractor-file-structure';

export default class ComponentFile extends JavaScriptFile {
    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }
}

ComponentFile.extension = '.component.js';
ComponentFile.type = 'components';

function deleteFileReferences () {
    let { references } = this.fileStructure;

    delete references[this.path];
}

tractorFileStructure.registerFileType(ComponentFile);
