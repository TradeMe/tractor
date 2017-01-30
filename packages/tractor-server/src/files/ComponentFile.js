// Constants:
const CLASS_ACTION_DECLARATION_QUERY = 'MemberExpression MemberExpression';
const CLASS_CONSTRUCTOR_DECLARATOR_QUERY = 'VariableDeclarator';
const CLASS_CONSTRUCTOR_FUNCTION_QUERY = 'FunctionExpression';
const CLASS_CONSTRUCTOR_NEW_QUERY = 'NewExpression';
const CLASS_RETURN_QUERY = 'ReturnStatement';
const INSTANCE_ACTION_CALL_QUERY = 'CallExpression MemberExpression';
const INSTANCE_DECLARATOR_QUERY = 'VariableDeclarator';

// Utilities:
import Promise from 'bluebird';
import camelcase from 'camel-case';
import pascalcase from 'pascal-case';

// Dependencies:
import JavaScriptFile from './JavaScriptFile';
import tractorFileStructure from 'tractor-file-structure';
import transformer from 'tractor-js-file-transformer';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default class ComponentFile extends JavaScriptFile {
    delete (options = {}) {
        let { references } = tractorFileStructure.fileStructure;
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

            let oldName = this.basename;
            let newName = newFile.basename;
            let oldClassName = pascalcase(oldName);
            let newClassName = pascalcase(newName);
            let oldInstanceName = camelcase(oldName);
            let newInstanceName = camelcase(newName);

            transformer.transformIdentifiers(newFile, oldClassName, newClassName, CLASS_CONSTRUCTOR_DECLARATOR_QUERY);
            transformer.transformIdentifiers(newFile, oldClassName, newClassName, CLASS_CONSTRUCTOR_FUNCTION_QUERY);
            transformer.transformIdentifiers(newFile, oldClassName, newClassName, CLASS_ACTION_DECLARATION_QUERY);
            transformer.transformIdentifiers(newFile, oldClassName, newClassName, CLASS_RETURN_QUERY);
            transformer.transformMetadata(newFile, oldName, newName, null);

            return Promise.map(referencePaths, referencePath => {
                let reference = tractorFileStructure.fileStructure.allFilesByPath[referencePath];

                transformer.transformIdentifiers(reference, oldClassName, newClassName, CLASS_CONSTRUCTOR_DECLARATOR_QUERY);
                transformer.transformIdentifiers(reference, oldClassName, newClassName, CLASS_CONSTRUCTOR_NEW_QUERY);
                transformer.transformIdentifiers(reference, oldInstanceName, newInstanceName, INSTANCE_DECLARATOR_QUERY);
                transformer.transformIdentifiers(reference, oldInstanceName, newInstanceName, INSTANCE_ACTION_CALL_QUERY);
                transformer.transformMetadata(reference, oldName, newName, newFile.type);
                transformer.transformRequirePaths(reference, {
                    fromPath: reference.path,
                    oldToPath: this.path,
                    newToPath: newFile.path
                });

                return reference.save(reference.ast);
            })
            .catch(() => {
                throw new TractorError(`Could not update references after moving ${this.path}.`);
            })
            .then(() => newFile.save(newFile.ast));
        });
    }
}

ComponentFile.prototype.extension = '.component.js';
ComponentFile.prototype.type = 'components';

tractorFileStructure.registerFileType(ComponentFile);
