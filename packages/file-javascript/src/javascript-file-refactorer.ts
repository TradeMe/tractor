// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { Refactorer } from '@tractor/file-structure';
import * as esquery from 'esquery';
import { Comment, Identifier, Literal } from 'estree';
import * as path from 'path';
import { JavaScriptFile } from './javascript-file';
import { JavaScriptFileMetaType } from './javascript-file-metadata';

export const JAVASCRIPT_FILE_REFACTORER: Refactorer<JavaScriptFile> = {
    identifierChange,
    literalChange,
    metadataChange,
    referencePathChange,
    versionChange
};

export type IdentifierChangeData = {
    context?: string;
    newName: string;
    oldName: string;
};

async function identifierChange (file: JavaScriptFile, data: IdentifierChangeData): Promise<void> {
    const { oldName, newName, context } = data;

    let query = `Identifier[name="${oldName}"]`;

    if (context) {
        query = `${context} > ${query}`;
    }

    esquery(file.ast, query).forEach(identifier => {
        (identifier as Identifier).name = newName;
    });
}

export type LiteralChangeData = {
    context: string;
    newValue: string;
    oldValue: string;
};

async function literalChange (file: JavaScriptFile, data: LiteralChangeData): Promise<void> {
    const { oldValue, newValue, context } = data;

    let query = `Literal[value="${oldValue}"]`;

    if (context) {
        query = `${context} > ${query}`;
    }

    esquery(file.ast, query).forEach(literal => {
        (literal as Literal).value = newValue;
        (literal as Literal).raw = `'${newValue}'`;
    });
}

export type MetadataChangeData = {
    newName: string;
    oldName: string;
    type: string;
};

async function metadataChange <MetadataType extends JavaScriptFileMetaType> (file: JavaScriptFile<MetadataType>, data: MetadataChangeData): Promise<void> {

    const metaToken = getMetaToken<MetadataType>(file);
    let metaData: MetadataType;
    try {
        metaData = JSON.parse(metaToken.value) as MetadataType;
    } catch {
        return;
    }

    let item: MetadataType | null = metaData;
    const { oldName, newName, type } = data;
    if (type && item && Array.isArray(item[type])) {
        item = (item[type] as Array<MetadataType>).find(i => i.name === oldName) || null;
    }
    if (item !== null) {
        item.name = newName;
    }
    metaToken.value = JSON.stringify(metaData);
}

export type ReferenceChangeData = {
    fromPath?: string;
    newFromPath?: string;
    newToPath?: string;
    oldFromPath?: string;
    oldToPath?: string;
    toPath?: string;
};

async function referencePathChange (file: JavaScriptFile, data: ReferenceChangeData): Promise<void> {
    let { oldFromPath, newFromPath } = data;
    if (!(oldFromPath && newFromPath)) {
        oldFromPath = newFromPath = data.fromPath!;
    }

    let { oldToPath, newToPath } = data;
    if (!(oldToPath && newToPath)) {
        oldToPath = newToPath = data.toPath!;
    }

    if (!oldFromPath) {
        throw new TractorError('Cannot perform this refactor without an `oldFromPath`.');
    }
    if (!oldToPath) {
        throw new TractorError('Cannot perform this refactor without an `oldToPath`.');
    }
    if (!newFromPath) {
        throw new TractorError('Cannot perform this refactor without an `newFromPath`.');
    }
    if (!newToPath) {
        throw new TractorError('Cannot perform this refactor without an `newToPath`.');
    }

    const oldRequirePath = getRelativeRequirePath(path.dirname(oldFromPath), oldToPath);
    const newRequirePath = getRelativeRequirePath(path.dirname(newFromPath), newToPath);
    updatePaths(file, oldRequirePath, newRequirePath);
}

export type VersionChangeData = {
    version: string;
};

async function versionChange <MetadataType extends JavaScriptFileMetaType> (file: JavaScriptFile<MetadataType>, data: VersionChangeData): Promise<void> {
    const { version } = data;
    const metaToken = getMetaToken(file);
    const metaData = JSON.parse(metaToken.value) as MetadataType;
    metaData.version = version;
    metaToken.value = JSON.stringify(metaData);
}

function getRelativeRequirePath (from: string, to: string): string {
    const relativePath = path.relative(from, to).replace(/\\/g, '/');
    return /^\./.test(relativePath) ? relativePath : `./${relativePath}`;
}

function getMetaToken <MetadataType extends JavaScriptFileMetaType> (file: JavaScriptFile<MetadataType>): Comment {
    const { comments } = file.ast!;
    if (!comments) {
        throw new TractorError(`Could not read metadata comment in "${file.path}".`);
    }

    const [comment] = comments;
    return comment;
}

function updatePaths (file: JavaScriptFile, oldRequirePath: string, newRequirePath: string): void {
    const query = `CallExpression[callee.name="require"] Literal[value="${oldRequirePath}"]`;
    esquery(file.ast, query).forEach(requirePathLiteral => {
        (requirePathLiteral as Literal).value = newRequirePath;
        (requirePathLiteral as Literal).raw = `'${newRequirePath}'`;
    });
}
