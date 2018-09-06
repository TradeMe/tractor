// Dependencies:
import { readFiles } from '@tractor/file-structure';
import { MochaSpecFile } from '../tractor/server/files/mocha-spec-file';
import * as esprima from 'esprima';
import esquery from 'esquery';
import estemplate from 'estemplate';
import path from 'path';

// Files:
const { FeatureFile } = require(path.join(path.dirname(require.resolve('@tractor-plugins/features')), 'tractor/server/files/feature-file'));
const { StepDefinitionFile } = require(path.join(path.dirname(require.resolve('@tractor-plugins/step-definitions')), 'tractor/server/files/step-definition-file'));

// Constants:
const STEP_TYPE_REGEX = /^(Given|Then|When)/;
const VERSION = '0.1.0';

// Queries:
const STEP_REGEX_QUERY = 'CallExpression[callee.property.name=/Given|When|Then/] > Literal';
const STEP_PARAMS_QUERY = 'CallExpression[callee.property.name=/Given|When|Then/] > FunctionExpression > Identifier[name!="done"]';
const MOCK_REQUEST_CALL_EXPRESSION_QUERY = 'CallExpression[callee.object.name="mockRequests"]';
const MOCK_DATA_REQUIRE_STATEMENT_QUERY = 'VariableDeclaration:has(CallExpression[callee.name="require"])';
const MOCK_DATA_INSTANCE_IDENTIFIER_QUERY = `${MOCK_DATA_REQUIRE_STATEMENT_QUERY} VariableDeclarator > Identifier`;
const ASSERTION_CALL_EXPRESSION_QUERY = 'CallExpression[callee.property.name="all"] > ArrayExpression > CallExpression';
const PAGE_OBJECT_REQUIRE_STATEMENT_QUERY = 'VariableDeclaration:has(CallExpression[callee.name="require"]):has(NewExpression)';
const PAGE_OBJECT_INSTANCE_IDENTIFIER_QUERY = `${PAGE_OBJECT_REQUIRE_STATEMENT_QUERY} VariableDeclarator:has(NewExpression) > Identifier`;
const INTERACTION_CALL_EXPRESSION_QUERY = 'VariableDeclaration VariableDeclarator[id.name=tasks] CallExpression[callee.property.name!="then"]';
const IMPORT_PATH_QUERY = 'CallExpression[callee.name="require"] > Literal';
const CALL_EXPRESSION_WITH_ARGUMENTS_QUERY = 'CallExpression[arguments.length>0]';

// Templates:
const SPEC_TEMPLATE = estemplate.compile(`

describe(<%= name %>, function () {
    %= tests %;
});

`);

const TEST_TEMPLATE = estemplate.compile(`

    it(<%= name %>, function () {
        %= mockRequests %;
        %= pageObjects %;

        var step = Promise.resolve();
        %= steps %;
        return step;
    });

`);


const PLUGIN_STEP_TEMPLATE = estemplate.compile(`

    step = step.then(function () {
        return <%= expression %>
    });

`);

const STEP_TEMPLATE = estemplate.compile(`

    step = step.then(function () {
        var element;
        element = <%= pageObject %>;
        return <%= expression %>
    });

`);

const UNIMPLEMENTED_STEP_TEMPLATE = esprima.parseScript(`

    step = step.then(function () {
        throw new Error('Step not implemented');
    });
    
`);

// Parsers:
const PARSERS = {
    given: parseGiven,
    when: parseWhen,
    then: parseThen
};

export async function upgrade (config, mochaSpecsFileStructure) {
    // Read all .feature files:
    const featuresFileStructure = await readFiles(config.features.directory, [FeatureFile]);

    // Read all .step.js files:
    const stepDefinitionsFileStructure = await readFiles(config.stepDefinitions.directory, [StepDefinitionFile]);

    const stepDefinitionRegExpMap = getStepDefinitonRegExpMaps(stepDefinitionsFileStructure);
    const regexps = Array.from(stepDefinitionRegExpMap.keys());

    // Create new .e2e-spec.js files:
    await Promise.all(featuresFileStructure.structure.allFiles.map(async feature => {
        const featureDirectoryPath = path.dirname(feature.url);
        const featureName = path.basename(feature.url, FeatureFile.prototype.extension);
        const newMochaSpecName = `${featureName}${MochaSpecFile.prototype.extension}`;
        const newMochaSpecPath = path.join(mochaSpecsFileStructure.path, featureDirectoryPath, newMochaSpecName);
        const newMochaSpecFile = new MochaSpecFile(newMochaSpecPath, mochaSpecsFileStructure);

        const features = feature.tokens.filter(feature => feature.type === 'Feature');
        await Promise.all(features.map(async feature => {
            const meta = {
                name: feature.name,
                tests: [],
                version: VERSION
            };
            const suiteName = `${feature.name}${formatTags(feature)}`;

            const scenarios = feature.elements.filter(element => element.type === 'Scenario');
            const tests = scenarios.map(scenario => {
                const scenarioName = `${scenario.name}${formatTags(scenario)}`;
                meta.tests.push({ name: scenarioName });

                const steps = {
                    given: [],
                    when: [],
                    then: []
                };
                
                const expressions = scenario.stepDeclarations.map(stepDeclaration => {
                    const regexp = regexps.find(regexp => !!regexp.test(stepDeclaration.step));
                    const stepDefinitionFile = stepDefinitionRegExpMap.get(regexp);
                    
                    if (!stepDefinitionFile) {
                        return [getExpression(UNIMPLEMENTED_STEP_TEMPLATE)];
                    }

                    let [type] = stepDefinitionFile.name.match(STEP_TYPE_REGEX);
                    type = type.toLowerCase();
                    const result = PARSERS[type](stepDefinitionFile.ast);
                    steps[type].push(result);

                    const { expressions, args, imports, params } = result;

                    const [, ...stepArgs] = stepDeclaration.step.match(regexp);
                    params.forEach((param, index) => {
                        args.forEach(arg => {
                            if (arg.name === param.name) {
                                arg.type = 'Literal',
                                delete arg.name;
                                arg.value = stepArgs[index];
                            }
                        });
                    });

                    imports.map(i => {
                        const [importPath] = esquery(i, 'CallExpression[callee.name="require"] > Literal');
                        const oldImportPath = path.resolve(path.dirname(stepDefinitionFile.path), importPath.value);
                        const newImportPath = path.relative(path.dirname(newMochaSpecPath), oldImportPath);
                        importPath.value = newImportPath;
                        return i;
                    });

                    return clone(expressions).map(expression => {
                        const pageObjects = imports.map(i => esquery(i, 'VariableDeclarator[init.type="NewExpression"] > Identifier')).flatten();
                        const pageObject = pageObjects.find(pageObject => {
                            const toRename = esquery(expression, `MemberExpression[object.name="${pageObject.name}"]`);
                            toRename.forEach(memberExpression => memberExpression.object = createIdentifier('element'));
                            return toRename.length;
                        });
                        if (pageObject) {
                            return getExpression(STEP_TEMPLATE({ expression, pageObject }));
                        }
                        return getExpression(PLUGIN_STEP_TEMPLATE({ expression }));
                    });
                });

                return getExpression(TEST_TEMPLATE({ 
                    name: createLiteral(scenarioName), 
                    mockRequests: getUsedImports(steps.given, MOCK_DATA_INSTANCE_IDENTIFIER_QUERY),
                    pageObjects: getUsedImports([...steps.when, ...steps.then], PAGE_OBJECT_INSTANCE_IDENTIFIER_QUERY), 
                    steps: expressions.flatten()
                }));
            });

            const spec = SPEC_TEMPLATE({ name: createLiteral(suiteName), tests });
            spec.comments = [createComment(meta)];
            await newMochaSpecFile.save(spec);
        }));
    }));
}

function getStepDefinitonRegExpMaps (stepDefinitionsFileStructure) {
    const regexps = new Map();
    stepDefinitionsFileStructure.structure.allFiles.forEach(file => {
        const [literal] = esquery(file.ast, STEP_REGEX_QUERY);
        regexps.set(new RegExp(literal.regex.pattern, literal.regex.flag), file);
    });
    return regexps;
}

function parseGiven (ast) {
    const cloned = clone(ast);
    return {
        args: esquery(cloned, CALL_EXPRESSION_WITH_ARGUMENTS_QUERY).map(callExpression => callExpression.arguments).flatten(),
        expressions: esquery(cloned, MOCK_REQUEST_CALL_EXPRESSION_QUERY),
        imports: esquery(cloned, MOCK_DATA_REQUIRE_STATEMENT_QUERY),
        params: esquery(cloned, STEP_PARAMS_QUERY)
    };
}

function parseThen (ast) {
    const cloned = clone(ast);
    return {
        args: esquery(cloned, CALL_EXPRESSION_WITH_ARGUMENTS_QUERY).map(callExpression => callExpression.arguments).flatten(),
        expressions: esquery(cloned, ASSERTION_CALL_EXPRESSION_QUERY),
        imports: esquery(cloned, PAGE_OBJECT_REQUIRE_STATEMENT_QUERY),
        params: esquery(cloned, STEP_PARAMS_QUERY)
    };
}

function parseWhen (ast) {
    const cloned = clone(ast);
    return {
        args: esquery(cloned, CALL_EXPRESSION_WITH_ARGUMENTS_QUERY).map(callExpression => callExpression.arguments).flatten(),
        expressions: esquery(cloned, INTERACTION_CALL_EXPRESSION_QUERY),
        imports: esquery(cloned, PAGE_OBJECT_REQUIRE_STATEMENT_QUERY),
        params: esquery(cloned, STEP_PARAMS_QUERY)
    };
}

function getUsedImports (steps, identifierQuery) {
    const unique = getUniqueImports(steps);
    const expressions = steps.map(step => step.expressions).flatten();
    return unique.filter(i => {
        const [identifier] = esquery(i, identifierQuery);
        return !!expressions.find(expression => esquery(expression, `Identifier[name="${identifier.name}"]`).length > 0);
    })
    .sort((a, b) => {
        const [pathALiteral] = esquery(a, IMPORT_PATH_QUERY); 
        const [pathBLiteral] = esquery(b, IMPORT_PATH_QUERY);
        const pathA = pathALiteral.value;
        const pathB = pathBLiteral.value;
        if(pathA > pathB) return -1;
        if(pathA < pathB) return 1;
        return 0;
    });
}

function getUniqueImports (steps) {
    const importNames = new Set();
    return steps.map(step => step.imports).flatten().filter(i => {
        const [importPath] = esquery(i, IMPORT_PATH_QUERY);
        const { value } = importPath;
        const has = importNames.has(value);
        if (!has) {
            importNames.add(value);
        }
        return !has;
    });
}

function createComment (data) {
    return {
        type: 'Block',
        value: JSON.stringify(data)
    };
}

function createIdentifier (name) {
    return {
        type: esprima.Syntax.Identifier,
        name
    };
}

function createLiteral (value) {
    return {
        type: esprima.Syntax.Literal,
        value
    };
}

function getExpression (program) {
    const [expression] = program.body;
    return expression;
}

function clone (node) {
    return JSON.parse(JSON.stringify(node));
}

function formatTags (element) {
    const tags = element.tags.map(t => t.replace(/^@/, '#')).join(' ');
    return tags.length > 0 ? ` ${tags}` : '';
}