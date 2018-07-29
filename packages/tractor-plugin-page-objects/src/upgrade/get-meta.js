export function getMeta (file) {
    const metaToken = getMetaToken(file);
    if (!metaToken || !metaToken.value) {
        return null;
    }
    return JSON.parse(metaToken.value);
}

export function getMetaToken (file) {
    const { ast } = file;
    const [firstComment] = ast.comments;
    return firstComment;
}
