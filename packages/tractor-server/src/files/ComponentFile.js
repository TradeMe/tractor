// Utilities:
import Promise from 'bluebird';
import changeCase from 'change-case';

// Dependencies:
import JavaScriptFile from './JavaScriptFile';
import tractorFileStructure from 'tractor-file-structure';
import transformer from 'tractor-js-file-transformer';

export default class ComponentFile extends JavaScriptFile {
    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }

    move (update, options) {
        let { oldPath } = update;
        let referencePaths = this.fileStructure.references[oldPath] || [];

        return super.move(update, options)
        .then(newFile => {
              let oldName = this.basename;
              let newName = newFile.basename;
              let oldClassName = changeCase.pascal(oldName);
              let newClassName = changeCase.pascal(newName);
              let oldInstanceName = changeCase.camel(oldName);
              let newInstanceName = changeCase.camel(newName);

              transformer.transformIdentifiers(newFile, oldClassName, newClassName);
              transformer.transformIdentifiers(newFile, oldInstanceName, newInstanceName);
              transformer.transformMetadata(newFile, oldName, newName, null);

              transformer.transformReferencesIdentifiers(referencePaths, oldClassName, newClassName);
              transformer.transformReferencesIdentifiers(referencePaths, oldInstanceName, newInstanceName);
              transformer.transformReferencesMetadata(referencePaths, oldName, newName, newFile.type);
              transformer.transformReferencesRequirePaths(referencePaths, this, newFile);

              return Promise.map(referencePaths, referencePath => {
                  let reference = tractorFileStructure.fileStructure.allFilesByPath[referencePath];
                  return reference.save(reference.ast);
              })
              .then(() => newFile.save(newFile.ast));
        });
    }
}

ComponentFile.prototype.extension = '.component.js';
ComponentFile.prototype.type = 'components';

function deleteFileReferences () {
    let { references } = this.fileStructure;

    delete references[this.path];
}

tractorFileStructure.registerFileType(ComponentFile);
