// Dependencies:
import { tsquery } from '@phenomnomnominal/tsquery';
import { tstemplate } from '@phenomnomnominal/tstemplate';
import { createIdentifier, createStringLiteral } from 'typescript';
import { PageObjectTypeScriptFile } from '../tractor/server/files/page-object-ts-file';

// Queries:
const PAGE_OBJECT_QUERY = 'ExpressionStatement > BinaryExpression:has([name="exports"]) > CallExpression > FunctionExpression > Block';
const PAGE_OBJECT_CONSTRUCTOR_QUERY = `${PAGE_OBJECT_QUERY} > VariableStatement:has(FunctionExpression) > VariableDeclarationList > VariableDeclaration`;
const PAGE_OBJECT_NAME_QUERY = tsquery.parse(`${PAGE_OBJECT_CONSTRUCTOR_QUERY} > Identifier`);
const PAGE_OBJECT_DEPENDENCY_NAME_QUERY = tsquery.parse('Identifier[name!="require"]');
const PAGE_OBJECT_DEPENDENCY_PATH_QUERY = tsquery.parse('StringLiteral');
const PAGE_OBJECT_DEPENDENCY_QUERY = tsquery.parse(`${PAGE_OBJECT_QUERY} > VariableStatement:has(CallExpression:has(Identifier[name="require"]))`);
const PAGE_OBJECT_HOST_QUERY = tsquery.parse(`${PAGE_OBJECT_CONSTRUCTOR_QUERY} BinaryExpression:has(PropertyAccessExpression:has(ThisKeyword):has(Identifier[name="host"]))`);
const PAGE_OBJECT_ELEMENT_QUERY = tsquery.parse(`${PAGE_OBJECT_CONSTRUCTOR_QUERY} BinaryExpression:has(PropertyAccessExpression:has(ThisKeyword)):has(CallExpression:has(Identifier[name=/^find$|^element$/]))`);
const PAGE_OBJECT_ELEMENT_NAME_QUERY = tsquery.parse(`PropertyAccessExpression:has(ThisKeyword) > Identifier`);
const PAGE_OBJECT_ELEMENT_STRING_QUERY = tsquery.parse(`CallExpression:has(PropertyAccessExpression:has(Identifier[name="by"])) StringLiteral`);
const PAGE_OBJECT_ELEMENT_SELECTOR_TYPE_QUERY = tsquery.parse(`CallExpression:has(PropertyAccessExpression:has(Identifier[name="by"])) PropertyAccessExpression:has(Identifier[name="by"]) Identifier[name!="by"]`);
const PAGE_OBJECT_ELEMENT_REPEATER_QUERY = tsquery.parse(`CallExpression:has(PropertyAccessExpression:has(Identifier[name="by"]):has(Identifier[name="repeater"]))`);
const PAGE_OBJECT_ELEMENT_CONSTRUCTOR_QUERY  = tsquery.parse(`NewExpression > Identifier`);
const PAGE_OBJECT_ELEMENT_GROUP_QUERY = tsquery.parse(`${PAGE_OBJECT_CONSTRUCTOR_QUERY} BinaryExpression:has(PropertyAccessExpression:has(ThisKeyword)):has(FunctionExpression)`);
const PAGE_OBJECT_ELEMENT_GROUP_NAME_QUERY = tsquery.parse(`PropertyAccessExpression > Identifier`);
const PAGE_OBJECT_ELEMENT_GROUP_SELECTOR_QUERY = tsquery.parse(`StringLiteral`);
const PAGE_OBJECT_ACTION_QUERY = tsquery.parse(`${PAGE_OBJECT_QUERY} ExpressionStatement:has(BinaryExpression:has(PropertyAccessExpression:has(Identifier[name="prototype"])))`);
const PAGE_OBJECT_ACTION_NAME_QUERY = tsquery.parse(`BinaryExpression > PropertyAccessExpression:has(PropertyAccessExpression) > Identifier`);
const PAGE_OBJECT_ACTION_METHOD_QUERY = tsquery.parse(`FunctionExpression`);
const PAGE_OBJECT_ACTION_PARAMETER_NAME_QUERY = tsquery.parse(`Identifier`);
const PAGE_OBJECT_INTERACTION_BLOCK_QUERY = tsquery.parse(`ExpressionStatement:has(BinaryExpression:has(Identifier[name="result"])) FunctionExpression FunctionExpression > Block:has(ReturnStatement:has(CallExpression))`);
const PAGE_OBJECT_INTERACTION_RESULT_QUERY = tsquery.parse(`ReturnStatement:has(CallExpression)`);
const PAGE_OBJECT_INTERACTION_CAUGHT_QUERY = tsquery.parse(`VariableDeclaration CallExpression`);
const PAGE_OBJECT_INTERACTION_ELEMENT_QUERY = tsquery.parse(`PropertyAccessExpression > PropertyAccessExpression`);
const PAGE_OBJECT_INTERACTION_ELEMENT_NAME_QUERY = tsquery.parse(`Identifier`);
const PAGE_OBJECT_INTERACTION_ELEMENT_GROUP_QUERY = tsquery.parse(`CallExpression > PropertyAccessExpression > CallExpression`);
const PAGE_OBJECT_INTERACTION_ELEMENT_GROUP_NAME_QUERY = tsquery.parse(`Identifier[name!='self']`);
const PAGE_OBJECT_INTERACTION_METHOD_QUERY = tsquery.parse(`CallExpression > PropertyAccessExpression > Identifier`);
const PAGE_OBJECT_INTERACTION_SELF_QUERY = `Identifier[name="self"]`;
const PAGE_OBJECT_INTERACTION_BROWSER_QUERY = tsquery.parse(`Identifier[name="browser"]`);
const PAGE_OBJECT_INTERACTION_BROWSER_METHOD_QUERY = tsquery.parse(`CallExpression > PropertyAccessExpression > Identifier[name!="browser"]`);

const ELEMENT_METHODS = {
    isPresent: `await isPresent(this._page, this.<%= target %>);`,
    isDisplayed: `await isDisplayed(this._page, this.<%= target %>);`,
    clear: `await this._page.click(this.<%= target %>, { clickCount: 3 }); await this._page.keyboard.press("Backspace");`,
    sendKeys: `await this._page.fill(this.<%= target %>, %= args %);`,
    getText: `await this._page.innerText(this.<%= target %>);`,
    getInputValue: `await getInputValue(this._page, this.<%= target %>);`,
    getBeforeContent: `await getBeforeContent(this._page, this.<%= target %>);`,
    selectOptionByIndex: `await selectOptionByIndex(this._page, this.<%= target %>, %= args %);`,
    selectOptionByText: `await selectOptionByText(this._page, this.<%= target %>, %= args %);`
};

const BROWSER_METHODS = {
    get: `await this._page.goto(url(%= args %));`,
    getCurrentUrl: `await this._page.url()`,
    sendEnterKey: `await this._page.keyboard.press("Enter");`,
    sendDeleteKey:  `await this._page.keyboard.press("Delete");`,
    sleep: `await this._page.waitForTimeout(%= args %);`,
    pasteText: `await pasteText(this._page, %= args %);`
};

const RETURN_TYPES = {
    getAttribute: (() => tsquery(tstemplate('class Foo { public bar (): Promise<string | null> {} }'), 'TypeReference'))(),
    getText: (() => tsquery(tstemplate('class Foo { public bar (): Promise<string> {} }'), 'TypeReference'))(),
    innerHTML: (() => tsquery(tstemplate('class Foo { public bar (): Promise<string> {} }'), 'TypeReference'))(),
    innerText: (() => tsquery(tstemplate('class Foo { public bar (): Promise<string> {} }'), 'TypeReference'))(),
    isChecked: (() => tsquery(tstemplate('class Foo { public bar (): Promise<boolean> {} }'), 'TypeReference'))(),
    isDisabled: (() => tsquery(tstemplate('class Foo { public bar (): Promise<boolean> {} }'), 'TypeReference'))(),
    isEditable: (() => tsquery(tstemplate('class Foo { public bar (): Promise<boolean> {} }'), 'TypeReference'))(),
    isEnabled: (() => tsquery(tstemplate('class Foo { public bar (): Promise<boolean> {} }'), 'TypeReference'))(),
    isHidden: (() => tsquery(tstemplate('class Foo { public bar (): Promise<boolean> {} }'), 'TypeReference'))(),
    isVisible: (() => tsquery(tstemplate('class Foo { public bar (): Promise<boolean> {} }'), 'TypeReference'))(),
    title: (() => tsquery(tstemplate('class Foo { public bar (): Promise<string> {} }'), 'TypeReference'))(),
    url: (() => tsquery(tstemplate('class Foo { public bar (): Promise<string> {} }'), 'TypeReference'))(),
    isPresent: (() => tsquery(tstemplate('class Foo { public bar (): Promise<boolean> {} }'), 'TypeReference'))(),
    isDisplayed: (() => tsquery(tstemplate('class Foo { public bar (): Promise<boolean> {} }'), 'TypeReference'))(),
    getInputValue: (() => tsquery(tstemplate('class Foo { public bar (): Promise<string> {} }'), 'TypeReference'))(),
};

const VOID = (() => tsquery(tstemplate('class Foo { public bar (): Promise<void> {} }'), 'TypeReference'))();

if (!(global.UPGRADE_FILE|| global.REFERENCE_PATHS)) {
    global.REFERENCE_PATHS = [];
    [global.UPGRADE_FILE] = Array.from(process.argv).reverse();
}

export async function upgrade (file) {
    await file.read();

    const { content, fileStructure, name, path } = file;

    const ast = tsquery.ast(content);

    const isSpecifiedFile = name.includes(global.UPGRADE_FILE);
    const isReferencedFile = global.REFERENCE_PATHS.some(referencePath => {
        return fileStructure.referenceManager.getReferences(referencePath).includes(file);
    });

    const isGoToPage = name === 'GoToPage.po.js';

    if (isGoToPage || !(isSpecifiedFile || isReferencedFile)) {
        return null;
    }

    global.REFERENCE_PATHS.push(path);
    
    const newFile = new PageObjectTypeScriptFile(file.path.replace(file.extension, PageObjectTypeScriptFile.prototype.extension), fileStructure);
    try {
        await newFile.read();
        // If file can be read, it's already been converted, so just return:
        return null;
    } catch {
        // Ignore
    }

    const [className] = tsquery.match(ast, PAGE_OBJECT_NAME_QUERY);

    const elements = tsquery.match(ast, PAGE_OBJECT_ELEMENT_QUERY);

    const imports = {
        createSelector: false
    };
    const names = {};
    let addSelect = false;

    const [usesHost] = tsquery.match(ast, PAGE_OBJECT_HOST_QUERY);
   
    if (usesHost) {
        names['host'] = '_host';
    }

    const elementPrivateFields = [];
    const elementPublicFields = [];
    const elementPublicInfo = {};
    elements.forEach(element => {
        let [originalName] = tsquery.match(element, PAGE_OBJECT_ELEMENT_NAME_QUERY);

        const [isRepeater] = tsquery.match(element, PAGE_OBJECT_ELEMENT_REPEATER_QUERY);

        if (isRepeater) {
            name = createIdentifier(`_${originalName.text}`);
            template = `
class Dummy {
    private <%= name %> = this._select(\`soz fam, couldn't convert a by.repeater selector...\`);
}
            `;
            names[originalName.text] = name.text;
            const code = tstemplate(template, { name });
            elementPrivateFields.push(...tsquery(code, 'PropertyDeclaration'));
            return;
        }

        const selectorTypes = tsquery.match(element, PAGE_OBJECT_ELEMENT_SELECTOR_TYPE_QUERY);
        if (selectorTypes.length > 1) {
            name = createIdentifier(`_${originalName.text}`);
            template = `
class Dummy {
    private <%= name %> = this._select(\`soz fam, couldn't convert a nested element selector...\`);
}
            `;
            names[originalName.text] = name.text;
            const code = tstemplate(template, { name });
            elementPrivateFields.push(...tsquery(code, 'PropertyDeclaration'));
            return;
        }
        const [selectorType] = selectorTypes;
        
        let selector;
        if (selectorType.text === 'cssContainingText') {
            const [css, text] = tsquery.match(element, PAGE_OBJECT_ELEMENT_STRING_QUERY);
            selector = createStringLiteral(`${css.text}:has-text("${text.text}")`);
        }
        if (selectorType.text === 'css') {
            const [css] = tsquery.match(element, PAGE_OBJECT_ELEMENT_STRING_QUERY);
            selector = css;
        }
        if (selectorType.text === 'buttonText' || selectorType.text === 'partialButtonText') {
            const [text] = tsquery.match(element, PAGE_OBJECT_ELEMENT_STRING_QUERY);
            selector = createStringLiteral(`button:has-text("${text.text}")`);
        }
        if (selectorType.text === 'linkText' || selectorType.text === 'partialLinkText') {
            const [text] = tsquery.match(element, PAGE_OBJECT_ELEMENT_STRING_QUERY);
            selector = createStringLiteral(`a:has-text("${text.text}")`);
        }
        if (selectorType.text === 'model') {
            name = createIdentifier(`_${originalName.text}`);
            template = `
class Dummy {
    private <%= name %> = this._select(\`soz fam, couldn't convert a by.model selector...\`);
}
            `;
            names[originalName.text] = name.text;
            const code = tstemplate(template, { name });
            elementPrivateFields.push(...tsquery(code, 'PropertyDeclaration'));
            return;
        }

        const [constructor] = tsquery.match(element, PAGE_OBJECT_ELEMENT_CONSTRUCTOR_QUERY);
        
        let fields = elementPublicFields;
        let name = originalName;
        let template;
        addSelect = true;
        if (constructor) {
            elementPublicInfo[name.text] = { constructor };
            template = `
class Dummy {
    public <%= name %> = new <%= constructor %>(this._page, this._select.createSelector(%= selector %))
}
            `;
        } else {
            fields = elementPrivateFields;
            name = createIdentifier(`_${name.text}`);
            template = `
class Dummy {
    private <%= name %> = this._select(%= selector %);
}
            `;
        }

        names[originalName.text] = name.text;

        const code = tstemplate(template, { name, constructor, selector });
        fields.push(...tsquery(code, 'PropertyDeclaration'));
    });

    if (usesHost) {
        const template = `
class Dummy {
    private _host = this._select();
}
        `;
        const code = tstemplate(template);
        elementPrivateFields.unshift(...tsquery(code, 'PropertyDeclaration'));
    }

    const elementsGroups = tsquery.match(ast, PAGE_OBJECT_ELEMENT_GROUP_QUERY);

    const elementGroupsInfo = {};
    const elementGroupFields = elementsGroups.flatMap(elementsGroup => {
        const [name] = tsquery.match(elementsGroup, PAGE_OBJECT_ELEMENT_GROUP_NAME_QUERY);

        const [selector] = tsquery.match(elementsGroup, PAGE_OBJECT_ELEMENT_GROUP_SELECTOR_QUERY);

        const [constructor] = tsquery.match(elementsGroup, PAGE_OBJECT_ELEMENT_CONSTRUCTOR_QUERY);

        let template;
        addSelect = true;
        if (constructor) {
            template = `
class Dummy {
    public <%= name %> (index: string): <%= constructor%> {
        return new <%= constructor %>(this._page, this._select.createGroupSelector(<%= selector %>, index));
    }
}
            `;
        } else {
            template = `
class Dummy {
    public <%= name %> (index: string): string {
        return this._select.createGroupSelector(<%= selector %>, index)();
    }
}
            `;
        }
        elementGroupsInfo[name.text] = { constructor };
        const code = tstemplate(template, { constructor, name, selector });
        return tsquery(code, 'MethodDeclaration');
    });

    const actions = tsquery.match(ast, PAGE_OBJECT_ACTION_QUERY);
    let returnType;

    const actionDeclarations = actions.flatMap(action => {
        const [name] = tsquery.match(action, PAGE_OBJECT_ACTION_NAME_QUERY);

        const [actionMethod] = tsquery.match(action, PAGE_OBJECT_ACTION_METHOD_QUERY);
        const parameters = actionMethod.parameters.flatMap(parameter => {
            const [name] = tsquery.match(parameter, PAGE_OBJECT_ACTION_PARAMETER_NAME_QUERY);
            const code = tstemplate(`
class Dummy {
    public async dummy (<%= name %>: string) { }
}
        `, { name });
            return tsquery(code, 'Parameter');
        });

        const interactionBlock = tsquery.match(action, PAGE_OBJECT_INTERACTION_BLOCK_QUERY);

        const interactionStatements = interactionBlock.flatMap(interactionBlock => {
            let [selfInteraction] = tsquery.match(interactionBlock, PAGE_OBJECT_INTERACTION_CAUGHT_QUERY);

            if (!selfInteraction) {
                [selfInteraction] = tsquery.match(interactionBlock, PAGE_OBJECT_INTERACTION_RESULT_QUERY);
            }

            const interaction = tsquery.map(selfInteraction, PAGE_OBJECT_INTERACTION_SELF_QUERY, () => createIdentifier('this'));
            const args = interaction.expression.arguments;

            try {
                const [element] = tsquery.match(selfInteraction, PAGE_OBJECT_INTERACTION_ELEMENT_QUERY);

                if (element) {
                    const [method] = tsquery.match(selfInteraction, PAGE_OBJECT_INTERACTION_METHOD_QUERY);
                    const [,originalTarget] = tsquery.match(element, PAGE_OBJECT_INTERACTION_ELEMENT_NAME_QUERY);
                    const originalName = originalTarget.text;
                    const target = createIdentifier(names[originalName]);

                    if (elementPublicInfo[originalName]) {
                        const code = tstemplate(`
await this.<%= target %>.<%= method %>(%= args %);
                        `, { method, target, args });
                        return tsquery(code, 'AwaitExpression');
                    }
                    

                    const methodName = method.getText();
                    if (methodName === 'isPresent') {
                        imports.isPresent = true;
                    }
                    if (methodName === 'getInputValue') {
                        imports.getInputValue = true;
                    }
                    if (methodName === 'getBeforeContent') {
                        imports.getBeforeContent = true;
                    }
                    if (methodName === 'selectOptionByIndex') {
                        imports.selectOptionByIndex = true;
                    }
                    if (methodName === 'selectOptionByText') {
                        imports.selectOptionByText = true;
                    }
                    if (methodName === 'isDisplayed') {
                        imports.isDisplayed = true;
                    }

                    returnType = RETURN_TYPES[method.text];

                    const template = ELEMENT_METHODS[methodName];
                    if (template) {
                        const code = tstemplate(template, { method, target, args });
                        return tsquery(code, 'AwaitExpression');
                    }

                    const code = tstemplate(`
await this._page.<%= method %>(this.<%= target %>, %= args %);
                    `, { method, target, args });
                    return tsquery(code, 'AwaitExpression');
                }

                const [elementGroup] = tsquery.match(selfInteraction, PAGE_OBJECT_INTERACTION_ELEMENT_GROUP_QUERY);
                if (elementGroup) {
                    const [elementGroupName] = tsquery.match(elementGroup, PAGE_OBJECT_INTERACTION_ELEMENT_GROUP_NAME_QUERY);

                    if (!elementGroupsInfo[elementGroupName.text].constructor) {
                        const [method] = tsquery.match(selfInteraction, PAGE_OBJECT_INTERACTION_METHOD_QUERY).reverse();
                        const code = tstemplate(`
await this._page.<%= method %>(this.<%= elementGroupName %>(%= args %));
                        `, { method, elementGroupName, args: elementGroup.arguments });
                        return tsquery(code, 'AwaitExpression'); 
                    }

                    const code = tstemplate(`
class Dummy {
public async dummy () {
    await <%= interaction %>;
};
}
                    `, { interaction: interaction.expression });
                    return tsquery(code, 'AwaitExpression');
                }


                const [browser] = tsquery.match(selfInteraction, PAGE_OBJECT_INTERACTION_BROWSER_QUERY);
                const [method] = tsquery.match(selfInteraction, PAGE_OBJECT_INTERACTION_BROWSER_METHOD_QUERY);

                if (browser && method) {
                    const methodName = method.getText();
                    if (methodName === 'pasteText') {
                        imports.pasteText = true;
                    }
                    if (methodName === 'get') {
                        imports.url = true;
                    }
                    const template = BROWSER_METHODS[methodName];
                    if (template) {
                        const code = tstemplate(template, { args });
                        return tsquery(code, 'AwaitExpression');
                    }
                }                
            } catch {
                // couldn't covert
            }

            const code = tstemplate(`
class Dummy {
public async dummy () {
    await <%= interaction %>;
};
}
            `, { interaction: interaction.expression });
            return tsquery(code, 'AwaitExpression');
        });

        const [lastInteraction] = interactionStatements.reverse();

        if (returnType && returnType.length) {
            const code = tstemplate(`
async function dummy () {
    return <%= interaction %>;
}
            `, { interaction: lastInteraction });
            const [r] = tsquery(code, 'ReturnStatement');
            interactionStatements[interactionStatements.length - 1] = r;
        }
        const [type] = returnType || VOID;

        const code = tstemplate(`
class Dummy {
    public async <%= name %> (%= parameters %): <%= type %> {
        <%= interactionStatements %>
    };
}
        `, { name, parameters, interactionStatements, type });
        return tsquery(code, 'MethodDeclaration');
    });

    const dependencies = tsquery.match(ast, PAGE_OBJECT_DEPENDENCY_QUERY);

    const dependencyImports = dependencies.flatMap(dependency => {
        const [name] = tsquery.match(dependency, PAGE_OBJECT_DEPENDENCY_NAME_QUERY);
        const [path] = tsquery.match(dependency, PAGE_OBJECT_DEPENDENCY_PATH_QUERY);
        path.text = path.text.replace('.po.js', '.page');
        const code = tstemplate(`
import { <%= name %> } from <%= path %>
        `, { name, path });
        return tsquery(code, 'ImportDeclaration');
    });


    const constructorArguments = [];
    if (addSelect || usesHost) {
        imports.Selector = true;
        let code;
        if (usesHost){ 
            code = tstemplate(`
class Dummy {
    constructor (private _select: Selector) { }
}
            `);
        } else { 
            imports.createSelector = true;
            code = tstemplate(`
class Dummy {
    constructor (private _select: Selector = createSelector()) { }
}   
            `);
        }
        const [select] = tsquery(code, 'Parameter');
        constructorArguments.push(select);
}

    const migrationHelpers = Object.keys(imports).filter(key => imports[key]).map(key => createIdentifier(key));
    const helperImports = [];
    if (migrationHelpers.length) {
        const code = tstemplate(`import { <%= migrationHelpers %> } from '@trademe/tractor-to-playwright';`, { migrationHelpers });
        const [migrationHelpersImport] = tsquery(code, 'ImportDeclaration');
        helperImports.push(migrationHelpersImport);
    }

    const result = tstemplate(`
import { Page } from '@playwright/test';

<%= helperImports %>
<%= dependencyImports %>

export class <%= className %> {
    <%= elementPublicFields %>

    <%= elementPrivateFields %>

    constructor (private _page: Page, %= constructorArguments %) { }

    <%= actionDeclarations %>
}
    `, { helperImports, dependencyImports,  className, constructorArguments, elementPublicFields: [...elementPublicFields, ...elementGroupFields], elementPrivateFields, actionDeclarations });

    await newFile.save(result);

    let ts = newFile.content;
    ts = ts.replace(`import { Page } from '@playwright/test';`, appendNewLine);
    ts = ts.replace(/import { .* } from '@trademe\/tractor-to-playwright';/, appendNewLine);
    ts = ts.replace(`export class`, prependNewLine);
    ts = ts.replace(` {2}constructor`, prependNewLine);
    ts = ts.replace(` {2}constructor`, (input) => prepend('  // tslint:disable-next-line:constructor-params-format\n', input));
    ts = ts.replace(/ {2}public async/g, prependNewLine);
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