// Constants:
import CONSTANTS from '../constants';
const LEADING_SLASH_REGEX = /^\//;
const TRAILING_SLASH_REGEX = /(\/)[gimuy]*?$/;
const REGEXP_CONTENT_REGEX = /^\/.*\/[gimuy]*?$/;
const REGEXP_FLAGS_REGEX = /([gimuy]*)$/;
const LITERAL = 'Literal';

// Utilities:
import _ from 'lodash';

// Dependencies:
import escodegen from 'escodegen';
import esprima from 'esprima';
import { File } from 'tractor-file-structure';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default class JavaScriptFile extends File {
    copy (toCopy) {
        let copyAst = _.cloneDeep(toCopy.ast, true);
        let [metaComment] = copyAst.comments;
        let meta = JSON.parse(metaComment.value);
        meta.name = this.name;
        metaComment.value = JSON.stringify(meta);
        return this.save(copyAst);
    }

    read () {
        return super.read()
        .then(content => {
            setAST.call(this, content);
            return content;
        })
        .catch(error => {
            console.error(error);
            throw new TractorError(`Parsing "${this.path}" failed.`, CONSTANTS.REQUEST_ERROR);
        });
    }

    save (ast) {
        ast.leadingComments = ast.comments;
        let javascript = escodegen.generate(rebuildRegExps(ast), {
            comment: true
        });

        return super.save(javascript)
        .then(content => {
            setAST.call(this, content);
            return content;
        })
        .catch(error => {
            console.error(error);
            throw new TractorError(`Saving "${this.path}" failed.`, CONSTANTS.REQUEST_ERROR);
        });
    }

    serialise () {
        let serialised = super.serialise();
        serialised.ast = this.ast;
        return serialised;
    }

    toJSON () {
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
    _.each(object, value => {
        if (value && isRegexLiteral(value)) {
            let regexContent = value.raw
            .replace(LEADING_SLASH_REGEX, '')
            .replace(TRAILING_SLASH_REGEX, '');
            let [regexFlags] = REGEXP_FLAGS_REGEX.exec(value.raw);
            value.value = new RegExp(regexContent, regexFlags);
        } else if (_.isArray(value) || _.isObject(value)) {
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
}
