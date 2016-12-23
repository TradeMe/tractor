// Utilities:
import Promise from 'bluebird';
import changeCase from 'change-case';
import path from 'path';

// Dependencies:
import { File } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';
import transformer from 'tractor-js-file-transformer';

export default class MockDataFile extends File {
    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }

    move (update, options) {
        let { oldPath, newPath } = update;
        let referencePaths = this.fileStructure.references[oldPath] || [];

        return super.move(update, options)
        .then(newFile => {
            let oldName = path.basename(oldPath, this.extension);
            let newName = path.basename(newPath, this.extension);
            let oldClassName = changeCase.pascal(oldName);
            let newClassName = changeCase.pascal(newName);
            let oldInstanceName = changeCase.camel(oldName);
            let newInstanceName = changeCase.camel(newName);

            transformer.transformReferencesIdentifiers(referencePaths, oldClassName, newClassName);
            transformer.transformReferencesIdentifiers(referencePaths, oldInstanceName, newInstanceName);
            transformer.transformReferencesMetadata(referencePaths, oldName, newName, newFile.type);
            transformer.transformReferencesRequirePaths(referencePaths, this.path, newFile.path);

            return Promise.map(referencePaths, referencePath => {
                let reference = tractorFileStructure.fileStructure.allFilesByPath[referencePath];
                return reference.save(reference.ast);
            });
        });
    }

    save (data) {
        return super.save(data);
    }

    serialise () {
        let serialised = super.serialise();
        serialised.content = this.content;
        return serialised;
    }
}

MockDataFile.prototype.extension = '.mock.json';
MockDataFile.prototype.type = 'mock-data';

function deleteFileReferences () {
    let { references } = this.fileStructure;

    delete references[this.path];
}

tractorFileStructure.registerFileType(MockDataFile);
