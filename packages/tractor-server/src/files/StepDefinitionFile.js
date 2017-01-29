// Constants:
const PENDING_IDENTIFIER = 'pending';
const PENDING_QUERY = 'CallExpression[callee.name="callback"] .arguments[value]';
const REQUIRE_QUERY = 'CallExpression[callee.name="require"] Literal';

// Utilities:
import path from 'path';

// Dependencies:
import esquery from 'esquery';
import JavaScriptFile from './JavaScriptFile';
import tractorFileStructure from 'tractor-file-structure';
import transformer from 'tractor-js-file-transformer';

export default class StepDefinitionFile extends JavaScriptFile {
    move (update, options) {
        let referencePaths = Object.keys(this.fileStructure.references)
        .filter(reference => this.fileStructure.references[reference].includes(this.path));

        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let move = super.move(update, options);

        return move.then(newFile => {
            referencePaths.forEach(referencePath => {
                transformer.transformRequirePaths(newFile, {
                    oldFromPath: this.path,
                    newFromPath: newFile.path,
                    toPath: referencePath
                });
            });

            return newFile.save(newFile.ast);
        });
    }

    read () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let read = super.read();

        return read.then(() => getFileReferences.call(this))
        .then(() => checkIfPending.call(this))
        .then(() => this.content);
    }

    save (data) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let save = super.save(data);

        return save.then(() => getFileReferences.call(this))
        .then(() => checkIfPending.call(this))
        .then(() => this.content);
    }
}

StepDefinitionFile.prototype.extension = '.step.js';
StepDefinitionFile.prototype.type = 'step-definitions';

function getFileReferences () {
    let { references } = this.fileStructure;

    Object.keys(references).forEach(filePath => {
        let referencePaths = references[filePath];
        if (referencePaths.includes(this.path)) {
            let index = referencePaths.indexOf(this.path);
            referencePaths.splice(index, 1);
        }
    });

    esquery(this.ast, REQUIRE_QUERY).forEach(requirePath => {
        let directoryPath = path.dirname(this.path);
        let referencePath = path.resolve(directoryPath, requirePath.value);
        references[referencePath] = references[referencePath] || [];
        references[referencePath].push(this.path);
    });
}

function checkIfPending () {
     this.isPending = false;

     let pendingIdentifiers = esquery(this.ast, PENDING_QUERY);
     pendingIdentifiers.forEach(pendingIdentifier => {
         if (pendingIdentifier.value === PENDING_IDENTIFIER) {
             this.isPending = true;
         }
     });
 }

tractorFileStructure.registerFileType(StepDefinitionFile);
