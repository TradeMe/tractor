// Dependencies:
import esquery from 'esquery';
import path from 'path';

export const JavaScriptFileRefactorer = {
    identifierChange,
    literalChange,
    metadataChange,
    referencePathChange,
    versionChange
};

function identifierChange (file, data) {
    const { oldName, newName, context } = data;

    let query = `Identifier[name="${oldName}"]`;

    if (context) {
        query = `${context} > ${query}`;
    }

    esquery(file.ast, query).forEach(identifier => identifier.name = newName);
}

function literalChange (file, data) {
    const { oldValue, newValue, context } = data;

    let query = `Literal[value="${oldValue}"]`;

    if (context) {
        query = `${context} > ${query}`;
    }

    esquery(file.ast, query).forEach(literal => {
        literal.value = newValue;
        literal.raw = `'${newValue}'`;
    });
}

function metadataChange (file, data) {
    const { oldName, newName, type } = data;
    const comment = getMetaToken(file);
    if (!comment) {
        return;
    }

    const metaData = JSON.parse(comment.value);
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

    const oldRequirePath = getRelativeRequirePath(path.dirname(oldFromPath), oldToPath);
    const newRequirePath = getRelativeRequirePath(path.dirname(newFromPath), newToPath);
    updatePaths(file, oldRequirePath, newRequirePath);
}

function versionChange (file, data) {
    const { version } = data;
    const metaToken = getMetaToken(file);
    const metaData = JSON.parse(metaToken.value);
    metaData.version = version;
    metaToken.value = JSON.stringify(metaData);
}

function getRelativeRequirePath (from, to) {
    const relativePath = path.relative(from, to).replace(/\\/g, '/');
    return /^\./.test(relativePath) ? relativePath : `./${relativePath}`;
}

function getMetaToken (file) {
    const { comments } = file.ast;
    if (!comments) {
        return;
    }

    const [comment] = comments;
    return comment;
}

function updatePaths (file, oldRequirePath, newRequirePath) {
    const query = `CallExpression[callee.name="require"] Literal[value="${oldRequirePath}"]`;
    esquery(file.ast, query).forEach(requirePathLiteral => {
        requirePathLiteral.value = newRequirePath;
        requirePathLiteral.raw = `'${newRequirePath}'`;
    });
}
