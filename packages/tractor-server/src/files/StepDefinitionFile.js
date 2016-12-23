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
import transformer from 'tractor-js-file-transformer';

export default class StepDefinitionFile extends JavaScriptFile {
    move (update, options) {
        let { oldPath } = update;
        let referencePaths = Object.keys(this.fileStructure.references)
        .filter(reference => this.fileStructure.references[reference].includes(oldPath));

        return super.move(update, options)
        .then(newFile => {
            transformer.transformReferencesRequirePaths(referencePaths, this.path, newFile.path);

            return Promise.map(referencePaths, referencePath => {
                let reference = tractorFileStructure.fileStructure.allFilesByPath[referencePath];
                return reference.save(reference.ast);
            });
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
