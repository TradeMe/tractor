// Constants:
const LEADING_SLASH_REGEX = /^\//;
const LITERAL = 'Literal';
const REGEXP_CONTENT_REGEX = /^\/.*\/[gimuy]*?$/;
const REGEXP_FLAGS_REGEX = /([gimuy]*)$/;
const REQUEST_ERROR = 400;
const REQUIRE_QUERY = 'CallExpression[callee.name="require"] Literal';
const TRAILING_SLASH_REGEX = /(\/)[gimuy]*?$/;

// Utilities:
import { isObject, isString } from 'util';

// Dependencies:
import escodegen from 'escodegen';
import * as esprima from 'esprima';
import esquery from 'esquery';
import path from 'path';
import { File } from '@tractor/file-structure';
import { JavaScriptFileRefactorer } from './javascript-file-refactorer';

// Errors:
import { TractorError } from '@tractor/error-handler';

export class JavaScriptFile extends File {
    async meta () {
        const metaToken = await getMetaToken.call(this);
        if (!metaToken || !metaToken.value) {
            return null;
        }
        return JSON.parse(metaToken.value);
    }

    async read () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        const read = super.read();

        try {
            const content = await read;
            setAST.call(this, content);
            getReferences.call(this);
            return this.content;    
        } catch {
            throw new TractorError(`Parsing "${this.path}" failed.`, REQUEST_ERROR);
        }
    }

    async refactor (type, data) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        const refactor = super.refactor(type, data);

        await refactor;
        const change = JavaScriptFileRefactorer[type];
        if (!change) {
            return;
        }
        await change(this, data);
        await this.save(this.ast);
    }

    async save (javascript) {
        if (!isString(javascript) && !Buffer.isBuffer(javascript)) {
            const ast = javascript;
            ast.leadingComments = ast.comments;
            javascript = escodegen.generate(rebuildRegExps(ast), {
                comment: true
            });
        }

        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        const save = super.save(javascript);

        try {
            const content = await save;
            setAST.call(this, content);
            getReferences.call(this);
            return this.content;
        } catch  {
            throw new TractorError(`Saving "${this.path}" failed.`, REQUEST_ERROR);
        }
    }

    serialise () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let serialised = super.serialise();

        serialised.ast = this.ast;
        return serialised;
    }

    toJSON () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let json = super.toJSON();

        let meta;
        try {
            let [metaComment] = this.ast.comments;
            meta = JSON.parse(metaComment.value);
        } catch (e) {
            meta = null;
        }
        json.meta = meta;
        return json;
    }
}

function rebuildRegExps (object) {
    Object.keys(object)
    .forEach(key => {
        let value = object[key];
        if (value && isRegexLiteral(value)) {
            let regexContent = value.raw
            .replace(LEADING_SLASH_REGEX, '')
            .replace(TRAILING_SLASH_REGEX, '');
            let [regexFlags] = REGEXP_FLAGS_REGEX.exec(value.raw);
            value.value = new RegExp(regexContent, regexFlags);
        } else if (Array.isArray(value) || isObject(value)) {
            rebuildRegExps(value);
        }
    });
    return object;
}

function getReferences () {
    if (this.initialised) {
        this.fileStructure.referenceManager.clearReferences(this.path);
    }

    esquery(this.ast, REQUIRE_QUERY).forEach(requirePath => {
        let directoryPath = path.dirname(this.path);
        let referencePath = path.resolve(directoryPath, requirePath.value);
        let reference = this.fileStructure.referenceManager.getReference(referencePath);
        if (reference) {
            this.addReference(reference);
        }
    });

    this.initialised = true;
}

function isRegexLiteral (object) {
    let { raw, type } = object;
    return type === LITERAL && raw && REGEXP_CONTENT_REGEX.test(raw);
}

function setAST (content) {
    this.ast = esprima.parseScript(content, {
        comment: true
    });
    this.data = this.ast;
    return content;
}
