// Constants:
const PENDING_IDENTIFIER = 'pending';
const PENDING_QUERY = 'CallExpression[callee.name="callback"] .arguments[value]';
const REQUIRE_QUERY = 'CallExpression[callee.name="require"] Literal';

// Utilities:
import path from 'path';

// Dependencies:
import esquery from 'esquery';
import { JavaScriptFile } from './JavaScriptFile';
import { registerFileType } from 'tractor-file-structure';

export class StepDefinitionFile extends JavaScriptFile {
    move (update, options) {
        let referencePaths = Object.keys(this.fileStructure.references)
        .filter(reference => this.fileStructure.references[reference].includes(this.path));

        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let move = super.move(update, options);

        return move.then(newFile => {
            referencePaths.forEach(referencePath => {
                newFile.transformRequirePaths({
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

    transformRequirePaths (options) {
        let { oldFromPath, newFromPath } = options;
        if (!(oldFromPath && newFromPath)) {
            oldFromPath = newFromPath = options.fromPath;
        }

        let { oldToPath, newToPath } = options;
        if (!(oldToPath && newToPath)) {
            oldToPath = newToPath = options.toPath;
        }

        let oldRequirePath = getRelativeRequirePath(path.dirname(oldFromPath), oldToPath);
        let newRequirePath = getRelativeRequirePath(path.dirname(newFromPath), newToPath);
        updatePaths.call(this, oldRequirePath, newRequirePath);
    }
}

StepDefinitionFile.prototype.extension = '.step.js';
StepDefinitionFile.prototype.type = 'step-definitions';

function checkIfPending () {
    this.isPending = false;

    let pendingIdentifiers = esquery(this.ast, PENDING_QUERY);
    pendingIdentifiers.forEach(pendingIdentifier => {
        if (pendingIdentifier.value === PENDING_IDENTIFIER) {
            this.isPending = true;
        }
    });
}

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

function getRelativeRequirePath (from, to) {
    let relativePath = path.relative(from, to).replace(/\\/g, '/');
    return /^\./.test(relativePath) ? relativePath : `./${relativePath}`;
}

function updatePaths (oldRequirePath, newRequirePath) {
    let query = `CallExpression[callee.name="require"] Literal[value="${oldRequirePath}"]`;

    esquery(this.ast, query).forEach(requirePathLiteral => {
        requirePathLiteral.value = newRequirePath;
        requirePathLiteral.raw = `'${newRequirePath}'`;
    });
}

registerFileType(StepDefinitionFile);
