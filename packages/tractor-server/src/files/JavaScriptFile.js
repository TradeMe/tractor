// Constants:
const LEADING_SLASH_REGEX = /^\//;
const LITERAL = 'Literal';
const REGEXP_CONTENT_REGEX = /^\/.*\/[gimuy]*?$/;
const REGEXP_FLAGS_REGEX = /([gimuy]*)$/;
const REQUEST_ERROR = 400;
const TRAILING_SLASH_REGEX = /(\/)[gimuy]*?$/;

// Utilities:
import isObject from 'lodash.isobject';

// Dependencies:
import escodegen from 'escodegen';
import esprima from 'esprima';
import { File } from 'tractor-file-structure';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default class JavaScriptFile extends File {
    read () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let read = super.read();

        return read.then(content => {
            setAST.call(this, content);
            return content;
        })
        .catch(() => {
            throw new TractorError(`Parsing "${this.path}" failed.`, REQUEST_ERROR);
        });
    }

    save (ast) {
        ast.leadingComments = ast.comments;
        let javascript = escodegen.generate(rebuildRegExps(ast), {
            comment: true
        });

        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let save = super.save(javascript);

        return save.then(content => {
            setAST.call(this, content);
            return content;
        })
        .catch(() => {
            throw new TractorError(`Saving "${this.path}" failed.`, REQUEST_ERROR);
        });
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

function isRegexLiteral (object) {
    return object.type === LITERAL
        && object.raw
        && REGEXP_CONTENT_REGEX.test(object.raw);
}

function setAST (content) {
    this.ast = esprima.parse(content, {
        comment: true
    });
    this.data = this.ast;
}
