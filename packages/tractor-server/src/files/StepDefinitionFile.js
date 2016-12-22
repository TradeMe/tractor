// Constants:
const REQUIRE_QUERY = 'CallExpression[callee.name="require"] Literal';

// Utilities:
import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';

// Dependencies:
import esquery from 'esquery';
import JavaScriptFile from './JavaScriptFile';
import tractorFileStructure from 'tractor-file-structure';
import transforms from '../api/transformers/transforms';

export default class StepDefinitionFile extends JavaScriptFile {
    move (update, options) {
        return super.move(update, options)
        .then(newFile => {
            let { oldPath, newPath } = update;
            if (oldPath && newPath) {
                console.log(oldPath, newPath);
                let references = Object.keys(this.fileStructure.references)
                .filter(reference => this.fileStructure.references[reference].includes(oldPath));

                return Promise.map(references, (reference) => {
                    return transforms.transformReferencePath(newFile, oldPath, reference, newPath, reference);
                });
            }
        });
    }

    read () {
        return super.read()
        .then(() => getFileReferences.call(this))
        .then(() => this.content);
    }

    save (data) {
        return super.save(data)
        .then(() => getFileReferences.call(this))
        .then(() => this.content);
    }
}

StepDefinitionFile.prototype.extension = '.step.js';
StepDefinitionFile.prototype.type = 'step-definitions';

function getFileReferences () {
    debugger;
    let { references } = this.fileStructure;

    _.each(references, referencePaths => {
        _.remove(referencePaths, referencePath => referencePath === this.path);
    });

    let requirePaths = esquery(this.ast, REQUIRE_QUERY);
    _.each(requirePaths, (requirePath) => {
        let directoryPath = path.dirname(this.path);
        let referencePath = path.resolve(directoryPath, requirePath.value);
        references[referencePath] = references[referencePath] || [];
        references[referencePath].push(this.path);
    });
}

tractorFileStructure.registerFileType(StepDefinitionFile);
