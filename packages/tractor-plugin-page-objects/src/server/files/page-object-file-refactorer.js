// Constants:
const CLASS_ACTION_DECLARATION_QUERY = 'MemberExpression MemberExpression';
const CLASS_CONSTRUCTOR_DECLARATOR_QUERY = 'VariableDeclarator';
const CLASS_CONSTRUCTOR_FUNCTION_QUERY = 'FunctionExpression';
const CLASS_RETURN_QUERY = 'ReturnStatement';

// Utilities:
import pascalcase from 'pascal-case';

export const PageObjectFileRefactorer = {
    fileNameChange
};

function fileNameChange (file, data) {
    let { oldName, newName } = data;

    let oldClassName = pascalcase(oldName);
    let newClassName = pascalcase(newName);

    return file.refactor('identifierChange', {
        oldName: oldClassName,
        newName: newClassName,
        context: CLASS_CONSTRUCTOR_DECLARATOR_QUERY
    })
    .then(() => file.refactor('identifierChange', {
        oldName: oldClassName,
        newName: newClassName,
        context: CLASS_CONSTRUCTOR_FUNCTION_QUERY
    }))
    .then(() => file.refactor('identifierChange', {
        oldName: oldClassName,
        newName: newClassName,
        context: CLASS_ACTION_DECLARATION_QUERY
    }))
    .then(() => file.refactor('identifierChange', {
        oldName: oldClassName,
        newName: newClassName,
        context: CLASS_RETURN_QUERY
    }))
    .then(() => file.refactor('metadataChange', {
        oldName,
        newName,
        type: null
    }));
}
