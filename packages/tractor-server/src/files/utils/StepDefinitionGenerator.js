// Constants:
const CUCUMBER_COMMAND = `node ${path.join('node_modules', 'cucumber', 'bin', 'cucumber')}`;
const GIVEN_WHEN_THEN_REGEX = /^(Given|When|Then)/;
const AND_BUT_REGEX = /^(And|But)/;
const STUB_REGEX_REGEX = /this\.[Given|When|Then]*\(\/\^(.*?)\$\//;
const NEW_LINE_REGEX = /\r\n|\n/;
const NEW_LINES_REGEX = /(\r\n|\n){2}/;
const STEP_DEFINITIONS_DIR = 'step-definitions';
const STEP_DEFINITION_REGEX = /^\s*this\.(Given|Then|When)[\s\S]*\}\);$/m;

// Utilities:
import last from 'lodash.last';
import path from 'path';
import Promise from 'bluebird';

// Dependencies:
const childProcess = Promise.promisifyAll(require('child_process'));
import esprima from 'esprima';
import estemplate from 'estemplate';
import StepDefinitionFile from '../StepDefinitionFile';
import stripcolorcodes from 'stripcolorcodes';

export default class StepDefinitionGenerator {
    constructor (file) {
        this.file = file;
    }

    generate () {
        let { content, path } = this.file;
        let stepNames = extractStepNames(content);

        return childProcess.execAsync(`${CUCUMBER_COMMAND} "${path}"`)
        .then(result => generateStepDefinitionFiles.call(this, stepNames, result));
    }
}

function extractStepNames (feature) {
    return stripcolorcodes(feature)
    // Split on new-lines:
    .split(NEW_LINE_REGEX)
    // Remove whitespace:
    .map(line => line.trim())
    // Get out each step name:
    .filter(line => GIVEN_WHEN_THEN_REGEX.test(line) || AND_BUT_REGEX.test(line))
    .map((stepName, index, stepNames) => {
        if (AND_BUT_REGEX.test(stepName)) {
            let previousType = stepNames.slice(0, index + 1)
            .reduceRight((p, n) => {
                let type = n.match(GIVEN_WHEN_THEN_REGEX);
                return p || last(type);
            }, null);
            return stepName.replace(AND_BUT_REGEX, previousType);
        } else {
            return stepName;
        }
    });
}

function generateStepDefinitionFiles (stepNames, result) {
    let stepDefinitionExtension = StepDefinitionFile.prototype.extension;
    let { fileStructure } = this.file;
    let { structure } = fileStructure;

    let existingFileNames = fileStructure.structure.allFiles
    .filter(file => file.path.endsWith(stepDefinitionExtension))
    .map(file => file.basename);

    let stubs = splitResultToStubs(result);

    return Promise.map(stubs, stub => {
        let stubRegex = new RegExp(last(stub.match(STUB_REGEX_REGEX)));
        let stepName = stepNames.find(stepName => stubRegex.test(stepName));
        let fileData = generateStepDefinitionFile(existingFileNames, stub, stepName);
        if (fileData) {
            let { ast, fileName } = fileData;
            let filePath = path.join(structure.path, STEP_DEFINITIONS_DIR, `${fileName}${stepDefinitionExtension}`);
            let file = new StepDefinitionFile(filePath, fileStructure);
            return file.save(ast);
        }
    });
}

function splitResultToStubs (result) {
    let pieces = stripcolorcodes(result)
    // Split on new-lines:
    .split(NEW_LINES_REGEX);

    // Filter out everything that isn't a step definition:
    return pieces.filter(piece => !!STEP_DEFINITION_REGEX.exec(piece));
}

function generateStepDefinitionFile (existingFileNames, stub, name) {
    let fileName = name
    // Escape existing _s:
    .replace(/_/g, '__')
    // Replace / and \:
    .replace(/[\/\\]/g, '_')
    // Replace <s and >s:
    .replace(/</g, '_')
    .replace(/>/g, '_')
    // Replace ?, :, *, ". |:
    .replace(/[\?\:\*\"\|"]/g, '_')
    // Replace money:
    .replace(/\$\d+/g, '\$amount')
    // Replace numbers:
    .replace(/\d+/g, '\$number');

    if (!existingFileNames.includes(fileName)) {
        let template = 'module.exports = function () {%= body %};';
        let body = esprima.parse(stub).body;
        let ast = estemplate(template, { body });
        let meta = { name };
        ast.comments = [{
            type: 'Block',
            value: JSON.stringify(meta)
        }];
        return { ast, fileName };
    }
}
