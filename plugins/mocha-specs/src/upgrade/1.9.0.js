// Dependencies:
import { tsquery } from '@phenomnomnominal/tsquery';
import { tstemplate } from '@phenomnomnominal/tstemplate';
import { MochaSpecTypeScriptFile } from '../tractor/server/files/mocha-spec-ts-file';
import { createIdentifier, createLiteral, createPrinter } from 'typescript';

// Queries:
const MOCHA_SPEC_DESCRIBE_QUERY = 'CallExpression:has(Identifier[name="describe"])';
const MOCHA_SPEC_DESCRIBE_NAME_QUERY = tsquery.parse(`${MOCHA_SPEC_DESCRIBE_QUERY} StringLiteral`);
const MOCHA_SPEC_IT_QUERY = tsquery.parse(`${MOCHA_SPEC_DESCRIBE_QUERY} CallExpression:has(Identifier[name="it"])`);
const MOCHA_SPEC_IT_NAME_QUERY = tsquery.parse('StringLiteral');
const MOCHA_SPEC_DEPENDENCY_QUERY = tsquery.parse('VariableStatement:has(CallExpression:has(Identifier[name="require"]))');
const MOCHA_SPEC_DEPENDENCY_NAME_QUERY = tsquery.parse('VariableDeclaration > Identifier');
const MOCHA_SPEC_DEPENDENCY_PATH_QUERY = tsquery.parse('CallExpression > StringLiteral');
const MOCHA_SPEC_DEPENDENCY_INSTANTIATION_QUERY = tsquery.parse('VariableDeclaration:has(NewExpression)');
const MOCHA_SPEC_STEP_QUERY = tsquery.parse('BinaryExpression CallExpression:has(Identifier[name="then"]) > FunctionExpression');
const MOCHA_SPEC_STEP_INSTANCE_QUERY = tsquery.parse('Identifier[name!="element"]');
const MOCHA_SPEC_STEP_LINES_QUERY = tsquery.parse('CallExpression:not(:has(Identifier[name="eventually"])), ExpressionStatement > BinaryExpression > PropertyAccessExpression:has(Identifier[name="element"])');
const MOCHA_SPEC_EXPECTATION_QUERY = tsquery.parse('Identifier[name="expect"]');
const MOCHA_SPEC_EXPECTATION_STEP_QUERY = tsquery.parse('CallExpression:not(:has(Identifier[name="expect"]))');
const MOCHA_SPEC_EXPECTATION_COMPARISON_EQUAL_QUERY = tsquery.parse('CallExpression:has(Identifier[name="eventually"]):has(Identifier[name="equal"])');
const MOCHA_SPEC_EXPECTATION_COMPARISON_CONTAIN_QUERY = tsquery.parse('CallExpression:has(Identifier[name="eventually"]):has(Identifier[name="contain"])');
const MOCHA_SPEC_MOCK_TYPE_QUERY = tsquery.parse('Identifier[name!="mockRequests"]');
const MOCHA_SPEC_MOCK_PASS_THROUGH_QUERY = tsquery.parse('Identifier[name="passThrough"]');
const MOCHA_SPEC_STEP_GO_TO_PAGE = tsquery.parse('Identifier[name="goToPage"]');

const printer = createPrinter();

if (!(global.UPGRADE_FILE|| global.REFERENCE_PATHS)) {
    global.REFERENCE_PATHS = [];
    [global.UPGRADE_FILE] = Array.from(process.argv).reverse();
}

export async function upgrade (file) {
    await file.read();

    const { content, fileStructure, name, path } = file;

    const ast = tsquery.ast(content);

    const isSpecifiedFile = name.includes(global.UPGRADE_FILE);

    if (!isSpecifiedFile) {
        return null;
    }
    
    global.REFERENCE_PATHS.push(path);

    const newFile = new MochaSpecTypeScriptFile(file.path.replace(file.extension, MochaSpecTypeScriptFile.prototype.extension), fileStructure);
    try {
        await newFile.read();
        // If file can be read, it's already been converted, so just return:
        return null;
    } catch {
        // Ignore
    }

    const [specName] = tsquery.match(ast, MOCHA_SPEC_DESCRIBE_NAME_QUERY);
   
    const imports = {};
    const mocks = {};

    const helpers = {
        mockRequests: false
    };

    const its = tsquery.match(ast, MOCHA_SPEC_IT_QUERY);
    const tests = its.flatMap(it => {
        const [testName] = tsquery.match(it, MOCHA_SPEC_IT_NAME_QUERY);

        const dependencies = tsquery.match(it, MOCHA_SPEC_DEPENDENCY_QUERY);

        const instances = dependencies.flatMap(dependency => {
            const [dependencyName] = tsquery.match(dependency, MOCHA_SPEC_DEPENDENCY_NAME_QUERY);
            const [dependencyPath] = tsquery.match(dependency, MOCHA_SPEC_DEPENDENCY_PATH_QUERY);

            if (dependencyPath.text.endsWith('.json')) {
                mocks[dependencyPath.text] = [dependencyName, dependencyPath];
                return [];
            } if (dependencyName.text !== 'GoToPage') {
                imports[dependencyPath.text] = [dependencyName, createLiteral(dependencyPath.text.replace('.po.js', '.page'))];
            }

            const [instance] = tsquery.match(dependency, MOCHA_SPEC_DEPENDENCY_INSTANTIATION_QUERY);

            if (!instance) {
                return [];
            }

            const instanceName = instance.name;

            if (instanceName.text === 'goToPage') {
                return [];
            }

            const code = tstemplate(`
const <%= instanceName %> = new <%= dependencyName %>(page);
            `, { instanceName, dependencyName });
            return tsquery(code, 'VariableStatement');
        });

        const steps = tsquery.match(it, MOCHA_SPEC_STEP_QUERY).flatMap(step => {
            const [instanceName] = tsquery.match(step, MOCHA_SPEC_STEP_INSTANCE_QUERY);
            const lines = tsquery.match(step, MOCHA_SPEC_STEP_LINES_QUERY);

            let target = instanceName;
            let nextLine = lines.shift();

            if (target.getText() === 'Error') {
                return [];
            }

            let call;
            if (target.getText() === 'mockRequests') {
                call = nextLine;
                const [passThrough] = tsquery.match(call, MOCHA_SPEC_MOCK_PASS_THROUGH_QUERY);
                if (passThrough) {
                    return [];
                }
                helpers.mockRequests = true;
                const [httpMethod] = tsquery.match(call, MOCHA_SPEC_MOCK_TYPE_QUERY);
                const code = tstemplate(`
await mockRequests.<%= httpMethod %>(page, %= args %);
                `, { httpMethod, args: call.arguments });
                return tsquery(code, 'ExpressionStatement');
            }

            let hasExpectation = false;
            while (nextLine) {
                const [expectation] = tsquery.match(nextLine, MOCHA_SPEC_EXPECTATION_QUERY);
                if (expectation) {
                    [nextLine] = tsquery.match(nextLine, MOCHA_SPEC_EXPECTATION_STEP_QUERY);
                    lines.shift();
                    hasExpectation = true;
                }
                if (!nextLine.arguments) {
                    const [element] = tsquery.match(nextLine, MOCHA_SPEC_STEP_INSTANCE_QUERY);
                    const code = printer.printFile(tstemplate(`
<%= target %>.<%= element %>;
                    `, { target, element }));
                    [target] = tsquery(code, 'PropertyAccessExpression');
                } else {
                    const [method] = tsquery.match(nextLine, MOCHA_SPEC_STEP_INSTANCE_QUERY);
                    const code = printer.printFile(tstemplate(`
<%= target %>.<%= method %>(%= args %);
                    `, { target, method, args: nextLine.arguments }));
                    [target] = tsquery(code, 'CallExpression');
                    call = target;
                }
                nextLine = lines.shift();
            }

            if (!hasExpectation) {
                const [isGoTo] = tsquery.match(call, MOCHA_SPEC_STEP_GO_TO_PAGE);
                let code;
                if (isGoTo) {
                    const args = tsquery.query(call, 'StringLiteral');
                    helpers.url = true;
                    code = tstemplate(`
await page.goto(url(%= args %));
                    `, { args });
                } else {
                    code = tstemplate(`
await <%= call %>;
                    `, { call });
                }
                return tsquery(code, 'ExpressionStatement');
            }

            const [expectationEqual] = tsquery.match(step, MOCHA_SPEC_EXPECTATION_COMPARISON_EQUAL_QUERY);
            if (expectationEqual) {
                const code = tstemplate(`
expect(await <%= call %>).toEqual(%= args %);
                `, { call, args: expectationEqual.arguments });
                return tsquery(code, 'ExpressionStatement');
            }
            const [expectationContain] = tsquery.match(step, MOCHA_SPEC_EXPECTATION_COMPARISON_CONTAIN_QUERY);
            if (expectationContain) {
                const code = tstemplate(`
expect(await <%= call %>).toContain(%= args %);
                `, { call, args: expectationContain.arguments });
                return tsquery(code, 'ExpressionStatement');
            }
        });

        const code = tstemplate(`
test(<%= testName %>, async ({ page }) => {
    <%= instances %>
    replace();
    <%= steps %>
});
        `, { testName, instances, steps });
        const [test] = tsquery(code, 'ExpressionStatement');
        return test;
    });

    const importDeclarations = Object.keys(imports).flatMap(name => {
        const [dependencyName, dependencyPath] = imports[name];
        const code = tstemplate(`
import { <%= dependencyName %> } from <%= dependencyPath %>;
        `, { dependencyName, dependencyPath });
        return tsquery(code, 'ImportDeclaration');        
    });

    const mockDeclarations = Object.keys(mocks).flatMap(name => {
        const [dependencyName, dependencyPath] = mocks[name];
        const code = tstemplate(`
import * as <%= dependencyName %> from <%= dependencyPath %>;
        `, { dependencyName, dependencyPath });
        return tsquery(code, 'ImportDeclaration');  
    });

    const migrationHelpers = Object.keys(helpers).filter(key => helpers[key]).map(key => createIdentifier(key));
    const helperImports = [];
    if (migrationHelpers.length) {
        const code = tstemplate(`import { <%= migrationHelpers %> } from '@trademe/tractor-to-playwright';`, { migrationHelpers });
        const [migrationHelpersImport] = tsquery(code, 'ImportDeclaration');
        helperImports.push(migrationHelpersImport);
    }

    const result = tstemplate(`
import { test, expect } from '@playwright/test';
<%= helperImports %>

<%= importDeclarations %>

<%= mockDeclarations %>

test.describe(<%= specName %>, () => {
    <%= tests %>
});
    `, { helperImports, mockDeclarations, importDeclarations, specName, tests });

    await newFile.save(result);

    let ts = newFile.content;
    ts = ts.replace(`import { test, expect } from '@playwright/test';`, appendNewLine);
    ts = ts.replace(`import {`, prependNewLine);
    ts = ts.replace(`import * `, prependNewLine);
    ts = ts.replace(`test.describe`, prependNewLine);
    let multipleTests = false;
    ts = ts.replace(/ {2}test\(/g, (test) => {
        if (!multipleTests) {
            return test;
        }
        multipleTests = true;
        return prependNewLine(test);
    });
    ts = ts.replace(/replace\(\);/g, '');
    ts = ts.replace(/ {4}expect\(/g, prependNewLine);
    await newFile.save(ts);
    return null;
}

function appendNewLine (input) { 
    return `${input}\n`;
}

function prependNewLine (input) { 
    return prepend(`\n`, input);
}

function prepend (pre, input) { 
    return `${pre}${input}`;
}