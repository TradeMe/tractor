// Dependencies:
import esquery from 'esquery';
import path from 'path';

export const JavaScriptFileRefactorer = {
    identifierChange,
    metadataChange,
    referencePathChange
}

function identifierChange (file, data) {
    let { oldName, newName, context } = data;

    let query = `Identifier[name="${oldName}"]`;

    if (context) {
        query = `${context} > ${query}`;
    }

    esquery(file.ast, query).forEach(identifier => identifier.name = newName);
}

function metadataChange (file, data) {
    let { oldName, newName, type } = data;
    let { comments } = file.ast;
    if (!comments) {
        return;
    }

    let [comment] = comments;
    if (!comment) {
        return;
    }

    let metaData = JSON.parse(comment.value);
    let item = metaData;
    if (type) {
        item = item[type].find(item => item.name === oldName);
    }
    item.name = newName;
    comment.value = JSON.stringify(metaData);
}

function referencePathChange (file, data) {
    let { oldFromPath, newFromPath } = data;
    if (!(oldFromPath && newFromPath)) {
        oldFromPath = newFromPath = data.fromPath;
    }

    let { oldToPath, newToPath } = data;
    if (!(oldToPath && newToPath)) {
        oldToPath = newToPath = data.toPath;
    }

    let oldRequirePath = getRelativeRequirePath(path.dirname(oldFromPath), oldToPath);
    let newRequirePath = getRelativeRequirePath(path.dirname(newFromPath), newToPath);
    updatePaths(file, oldRequirePath, newRequirePath);
}

function getRelativeRequirePath (from, to) {
    let relativePath = path.relative(from, to).replace(/\\/g, '/');
    return /^\./.test(relativePath) ? relativePath : `./${relativePath}`;
}

function updatePaths (file, oldRequirePath, newRequirePath) {
    let query = `CallExpression[callee.name="require"] Literal[value="${oldRequirePath}"]`;
    esquery(file.ast, query).forEach(requirePathLiteral => {
        requirePathLiteral.value = newRequirePath;
        requirePathLiteral.raw = `'${newRequirePath}'`;
    });
}
