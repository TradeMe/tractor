// Constants:
import constants from '../constants';
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
import File from './File';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default class JavaScriptFile extends File {
    read () {
        return super.read()
        .then(() => {
            this.ast = esprima.parse(this.content, {
                comment: true
            });
        })
        .catch((error) => {
            console.error(error);
            throw new TractorError(`Parsing "${this.path}" failed.`, constants.REQUEST_ERROR);
        });
    }

    save (data) {
        if (data) {
            this.ast = data;
        }
        if (this.ast) {
            this.ast.leadingComments = this.ast.comments;
            this.content = escodegen.generate(rebuildRegExps(this.ast), {
                comment: true
            });
        }

        return super.save()
        .catch((error) => {
            console.error(error);
            throw new TractorError(`Saving "${this.path}" failed.`, constants.REQUEST_ERROR);
        });
    }
}

function rebuildRegExps (object) {
    _.each(object, (value) => {
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
