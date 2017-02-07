// Constants:
const CLASS_CONSTRUCTOR_DECLARATOR_QUERY = 'VariableDeclarator';
const INSTANCE_DECLARATOR_QUERY = 'VariableDeclarator';

// Utilities:
import Promise from 'bluebird';
import camelcase from 'camel-case';
import pascalcase from 'pascal-case';
import path from 'path';

// Dependencies:
import { File } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';
import transformer from 'tractor-js-file-transformer';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default class MockDataFile extends File {
    delete (options = {}) {
        let { references } = this.fileStructure;
        let referencePaths = references[this.path];
        if (!options.isMove && referencePaths && referencePaths.length) {
            return Promise.reject(new TractorError(`Cannot delete ${this.path} as it is referenced by another file.`));
        }

        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let del = super.delete();

        return del.then(() => {
            delete references[this.path];
        });
    }

    move (update, options) {
        let referencePaths = this.fileStructure.references[this.path] || [];

        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let move = super.move(update, options);

        return move.then(newFile => {
            this.fileStructure.references[newFile.path] = referencePaths;

            let oldName = path.basename(this.path, this.extension);
            let newName = path.basename(newFile.path, this.extension);
            let oldClassName = pascalcase(oldName);
            let newClassName = pascalcase(newName);
            let oldInstanceName = camelcase(oldName);
            let newInstanceName = camelcase(newName);

            return Promise.map(referencePaths, referencePath => {
                let reference = this.fileStructure.allFilesByPath[referencePath];

                transformer.transformIdentifiers(reference, oldClassName, newClassName, CLASS_CONSTRUCTOR_DECLARATOR_QUERY);
                transformer.transformIdentifiers(reference, oldInstanceName, newInstanceName, INSTANCE_DECLARATOR_QUERY);
                transformer.transformMetadata(reference, oldName, newName, 'mockData');
                transformer.transformRequirePaths(reference, {
                    fromPath: reference.path,
                    oldToPath: this.path,
                    newToPath: newFile.path
                });

                return reference.save(reference.ast);
            })
            .catch(() => {
                throw new TractorError(`Could not update references after moving ${this.path}.`);
            });
        });
    }

    save (data) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let save = super.save(data);

        return save;
    }

    serialise () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let serialised = super.serialise();

        serialised.content = this.content;
        return serialised;
    }
}

MockDataFile.prototype.extension = '.mock.json';
MockDataFile.prototype.type = 'mock-data';

tractorFileStructure.registerFileType(MockDataFile);
