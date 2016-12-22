// Utilities:
import changeCase from 'change-case';
import path from 'path';

// Dependencies:
import JavaScriptFile from './JavaScriptFile';
import tractorFileStructure from 'tractor-file-structure';
import transforms from '../api/transformers/transforms';

export default class ComponentFile extends JavaScriptFile {
    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }

    move (update, options) {
        let { oldPath, newPath } = update;
        let references = this.fileStructure.references[oldPath] || [];

        return super.move(update, options)
        .then(newFile => {
              let oldName = path.basename(oldPath, this.extension);
              let newName = path.basename(newPath, this.extension);

              return transforms.transformIdentifiers(newFile, changeCase.pascal(oldName), changeCase.pascal(newName))
              .then(() => transforms.transformIdentifiers(newFile, changeCase.camel(oldName), changeCase.camel(newName)))
              .then(() => transforms.transformMetadata(newFile, null, oldName, newName))
              .then(() => transforms.transformReferences('components', oldPath, newPath, oldName, newName))
              .then(() => transforms.transformReferenceIdentifiers(oldPath, changeCase.pascal(oldName), changeCase.pascal(newName)))
              .then(() => transforms.transformReferenceIdentifiers(oldPath, changeCase.camel(oldName), changeCase.camel(newName)));
        });
    }
}

ComponentFile.prototype.extension = '.component.js';
ComponentFile.prototype.type = 'components';

function deleteFileReferences () {
    debugger;
    let { references } = this.fileStructure;

    delete references[this.path];
}

tractorFileStructure.registerFileType(ComponentFile);
