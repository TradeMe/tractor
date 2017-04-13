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
import { JavaScriptFile } from './JavaScriptFile';
import { registerFileType } from 'tractor-file-structure';

// Errors:
import { TractorError } from 'tractor-error-handler';

export class ComponentFile extends JavaScriptFile {
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

            let oldName = this.basename;
            let newName = newFile.basename;
            let oldClassName = pascalcase(oldName);
            let newClassName = pascalcase(newName);
            let oldInstanceName = camelcase(oldName);
            let newInstanceName = camelcase(newName);

            newFile.transformIdentifiers(oldClassName, newClassName, CLASS_CONSTRUCTOR_DECLARATOR_QUERY);
            newFile.transformIdentifiers(oldClassName, newClassName, CLASS_CONSTRUCTOR_FUNCTION_QUERY);
            newFile.transformIdentifiers(oldClassName, newClassName, CLASS_ACTION_DECLARATION_QUERY);
            newFile.transformIdentifiers(oldClassName, newClassName, CLASS_RETURN_QUERY);
            newFile.transformMetadata(oldName, newName, null);

            return Promise.map(referencePaths, referencePath => {
                let reference = this.fileStructure.allFilesByPath[referencePath];

                reference.transformIdentifiers(oldClassName, newClassName, CLASS_CONSTRUCTOR_DECLARATOR_QUERY);
                reference.transformIdentifiers(oldClassName, newClassName, CLASS_CONSTRUCTOR_NEW_QUERY);
                reference.transformIdentifiers(oldInstanceName, newInstanceName, INSTANCE_DECLARATOR_QUERY);
                reference.transformIdentifiers(oldInstanceName, newInstanceName, INSTANCE_ACTION_CALL_QUERY);
                reference.transformMetadata(oldName, newName, newFile.type);
                reference.transformRequirePaths({
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

registerFileType(ComponentFile);
