// Constants:
const PAGE_OBJECT_CLASS_CONSTRUCTOR_DECLARATOR_QUERY = 'VariableDeclarator[init.callee.name="require"]';
const PAGE_OBJECT_CLASS_CONSTRUCTOR_NEW_QUERY = 'NewExpression';
const PAGE_OBJECT_INSTANCE_ACTION_CALL_QUERY = 'CallExpression MemberExpression';
const PAGE_OBJECT_INSTANCE_DECLARATOR_QUERY = 'VariableDeclarator';
const MOCK_REQUEST_INSTANCE_REQUIRE_QUERY = 'VariableDeclarator[init.callee.name="require"]';
const MOCK_REQUEST_INSTANCE_BODY_PROPERTY_QUERY = 'ObjectExpression > Property[key.name=body]';

// Dependencies:
import camelcase from 'camel-case';
import pascalcase from 'pascal-case';

export const MochaSpecFileRefactorer = {
    fileNameChange,
    referenceNameChange
};

async function fileNameChange (file, data) {
    let { oldName, newName } = data;

    await file.refactor('metadataChange', {
        oldName,
        newName,
        type: null
    });
    return file.refactor('literalChange', {
        oldValue: oldName,
        newValue: newName
    });
}

function referenceNameChange (file, data) {
    let { extension } = data;

    if (extension === '.mock.json') {
        return mockRequestFileNameChange(file, data);
    }
    if (extension === '.po.js') {
        return pageObjectFileNameChange(file, data);
    }
    return Promise.resolve();
}

async function mockRequestFileNameChange (file, data) {
    let { oldName, newName } = data;

    let oldInstanceName = camelcase(oldName);
    let newInstanceName = camelcase(newName);

    await file.refactor('identifierChange', {
        oldName: oldInstanceName,
        newName: newInstanceName,
        context: MOCK_REQUEST_INSTANCE_REQUIRE_QUERY
    });
    return file.refactor('identifierChange', {
        oldName: oldInstanceName,
        newName: newInstanceName,
        context: MOCK_REQUEST_INSTANCE_BODY_PROPERTY_QUERY
    });
}

async function pageObjectFileNameChange (file, data) {
    let { oldName, newName } = data;

    let oldClassName = pascalcase(oldName);
    let newClassName = pascalcase(newName);
    let oldInstanceName = camelcase(oldName);
    let newInstanceName = camelcase(newName);

    await file.refactor('identifierChange', {
        oldName: oldClassName,
        newName: newClassName,
        context: PAGE_OBJECT_CLASS_CONSTRUCTOR_DECLARATOR_QUERY
    });
    await file.refactor('identifierChange', {
        oldName: oldClassName,
        newName: newClassName,
        context: PAGE_OBJECT_CLASS_CONSTRUCTOR_NEW_QUERY
    });
    await file.refactor('identifierChange', {
        oldName: oldInstanceName,
        newName: newInstanceName,
        context: PAGE_OBJECT_INSTANCE_ACTION_CALL_QUERY
    });
    return file.refactor('identifierChange', {
        oldName: oldInstanceName,
        newName: newInstanceName,
        context: PAGE_OBJECT_INSTANCE_DECLARATOR_QUERY
    });
}
