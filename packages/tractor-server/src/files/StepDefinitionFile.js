// Constants:
const REQUIRE_QUERY = 'CallExpression[callee.name="require"] Literal';

// Utilities:
import _ from 'lodash';
import path from 'path';

// Dependencies:
import esquery from 'esquery';
import JavaScriptFile from './JavaScriptFile';

export default class StepDefinitionFile extends JavaScriptFile {
    read () {
        return super.read()
        .then(() => getFileReferences.call(this));
    }

    save (data) {
        return super.save(data)
        .then(() => getFileReferences.call(this));
    }
}

function getFileReferences () {
    let { references } = this.directory.fileStructure;

    _.each(references, (referencePaths) => {
        _.remove(referencePaths, (referencePath) => referencePath === this.path);
    });

    let requirePaths = esquery(this.ast, REQUIRE_QUERY);
    _.each(requirePaths, (requirePath) => {
        let directoryPath = path.dirname(this.path);
        let referencePath = path.resolve(directoryPath, requirePath.value);
        references[referencePath] = references[referencePath] || [];
        references[referencePath].push(this.path);
    });
}
