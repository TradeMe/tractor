// Constants:
const LEADING_SLASH_REGEX = /^\//;
const LITERAL = 'Literal';
const REGEXP_SELECTOR = 'Literal[raw]';
const REGEXP_CONTENT_REGEX = /^\/.*\/[gimuy]*?$/;
const REGEXP_FLAGS_REGEX = /([gimuy]*)$/;
const REQUEST_ERROR = 400;
const REQUIRE_QUERY = 'CallExpression[callee.name="require"] Literal';
const TRAILING_SLASH_REGEX = /(\/)[gimuy]*?$/;

// Dependencies:
import { File, RefactorData } from '@tractor/file-structure';
import * as escodegen from 'escodegen';
import { parseScript } from 'esprima';
import * as esquery from 'esquery';
import { BaseNode, Literal, Program, RegExpLiteral } from 'estree';
import * as path from 'path';
import { JavaScriptFileMetadata, JavaScriptFileMetaType } from './javascript-file-metadata';
import { JAVASCRIPT_FILE_REFACTORER } from './javascript-file-refactorer';

// Errors:
import { TractorError } from '@tractor/error-handler';

export class JavaScriptFile <MetadataType extends JavaScriptFileMetaType = JavaScriptFileMetaType> extends File {
    public ast?: Program;
    public initialised = false;

    public async meta (): Promise<MetadataType | null> {
        if (!this.ast) {
            await this.read();
        }
        return this._getMetaSync();
    }

    public async read (): Promise<string> {
        const read = super.read();

        try {
            const content = await read;
            this._setAST(content);
            this._getReferences();
            return this.content!;
        } catch {
            throw new TractorError(`Parsing "${this.path}" failed.`, REQUEST_ERROR);
        }
    }

    public async refactor (type: string, data?: RefactorData): Promise<void> {
        const refactor = super.refactor(type, data);

        await refactor;
        const change = JAVASCRIPT_FILE_REFACTORER[type];
        if (change) {
            const result = await change(this, data);
            if (result === null) {
                return;
            }
        }
        await this.save(this.ast as Program);
    }

    public async save (javascript: string | Buffer | Program): Promise<string> {
        let toSave: string | Buffer;
        if (typeof javascript !== 'string' && !Buffer.isBuffer(javascript)) {
            const ast = javascript;
            ast.leadingComments = ast.comments;
            toSave = escodegen.generate(this._rebuildRegExps(ast), {
                comment: true
            });
        } else {
            toSave = javascript;
        }

        const save = super.save(toSave);

        try {
            const content = await save;
            this._setAST(content);
            this._getReferences();
            return this.content as string;
        } catch  {
            throw new TractorError(`Saving "${this.path}" failed.`, REQUEST_ERROR);
        }
    }

    public serialise (): JavaScriptFileMetadata<MetadataType> {
        const serialised = super.serialise() as JavaScriptFileMetadata<MetadataType>;

        serialised.ast = this.ast;
        return serialised;
    }

    public toJSON (): JavaScriptFileMetadata<MetadataType> {
        const json = super.toJSON() as JavaScriptFileMetadata<MetadataType> ;
        json.meta = this._getMetaSync();
        return json;
    }

    private _getMetaSync (): MetadataType | null {
        try {
            const [metaComment] = this.ast!.comments!;
            return JSON.parse(metaComment.value) as MetadataType;
        } catch {
            return null;
        }
    }

    private _getReferences (): void {
        if (this.initialised) {
            this.fileStructure.referenceManager.clearReferences(this.path);
        }

        esquery(this.ast, REQUIRE_QUERY).forEach(requirePath => {
            const directoryPath = path.dirname(this.path);
            let referencePath = path.resolve(directoryPath, (requirePath as Literal).value as string);
            if (!path.extname(referencePath)) {
                referencePath = `${referencePath}${JavaScriptFile.prototype.extension}`;
            }
            const reference = this.fileStructure.referenceManager.getReference(referencePath);
            if (reference) {
                this.addReference(reference);
            }
        });

        this.initialised = true;
    }

    private _isRegexLiteral (object: BaseNode): object is RegExpLiteral {
        const { raw, type } = object as RegExpLiteral;
        return !!(type === LITERAL && raw && REGEXP_CONTENT_REGEX.test(raw));
    }

    private _rebuildRegExps (ast: Program): Program {
        esquery(ast, REGEXP_SELECTOR).forEach((node: BaseNode) => {
            if (this._isRegexLiteral(node)) {
                const { raw } = node;
                const regexContent = raw!
                    .replace(LEADING_SLASH_REGEX, '')
                    .replace(TRAILING_SLASH_REGEX, '');
                const [regexFlags] = REGEXP_FLAGS_REGEX.exec(raw!) || [''];
                node.value = new RegExp(regexContent, regexFlags);
            }
        });
        return ast;
    }

    private _setAST (content: string): string {
        this.ast = parseScript(content, {
            comment: true
        });
        return content;
    }
}

JavaScriptFile.prototype.extension = '.js';
