// Dependencies:
import { info } from '@tractor/logger';

// Constants:
const TAG_TOKEN = '#';
const INVERT_REGEXP = /^!/g;

// Rules for parsing tags:
// 1) If it starts with !, it will be inverted.
// 2) If it includes a #, all words that start with a hash will be optionally matched
// 3) Otherwise it'll just be consumed as a RegExp
//
export function setTags (mochaOpts, tag) {
    let invert = INVERT_REGEXP.test(tag);
    mochaOpts.invert = invert;
    if (invert) {
        info(`Running mocha with "--invert" set to "${invert}"`);
        tag = tag.replace(INVERT_REGEXP, '');
    }

    mochaOpts.grep = formatTag(tag);
    info(`Running mocha with "--grep" set to "${mochaOpts.grep}"`);

}

function formatTag (tag) {
    if (tag.includes(TAG_TOKEN)) {
        return tag.split(/\s/).reduce((p, n, i, arr) => {
            const previous = arr[i - 1];
            return `${p}${previous.startsWith(TAG_TOKEN) || n.startsWith(TAG_TOKEN) ? '|' : ' '}${n}`;
        });
    }

    return tag;
}
