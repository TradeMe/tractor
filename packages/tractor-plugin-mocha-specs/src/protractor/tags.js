// Dependencies:
import { info } from '@tractor/logger';

// Constants
const TAGS_REGEXP = /\s+/g;
const INVERT_REGEXP = /^!/g;

export function setTags (mochaOpts, tag) {
    mochaOpts.grep = formatTag(tag);
    info(`Running mocha with "--grep" set to "${mochaOpts.grep}"`);

    let invert = INVERT_REGEXP.test(tag);
    mochaOpts.invert = invert;
    if (invert) {
        info(`Running mocha with "--invert" set to "${invert}"`);
    }
}

function formatTag (tag) {
    return tag.replace(INVERT_REGEXP, '').replace(TAGS_REGEXP, '|');
}
