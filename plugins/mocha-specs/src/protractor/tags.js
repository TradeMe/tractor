// Dependencies:
import { info } from '@tractor/logger';
import { parse } from 'esprima';
import esquery from 'esquery';
import fs from 'fs';
import glob from 'glob';

// Constants:
const TAG_TOKEN = '#';
const INVERT_TOKEN = '!';
const DESCRIBE_QUERY = 'CallExpression[callee.name=/describe|it/] > Literal, CallExpression[callee.object.name=/describe|it/] > Literal';
const MOCHA_SPECS_SHARDED_FILTERED_KEY = '__TRACTOR_MOCHA_SPECS_SHARDED_FILTERED';

export function setupTags (tag, protractorConf, isSharded) {
    const { mochaOpts } = protractorConf;

    const invert = tag.startsWith(INVERT_TOKEN);
    mochaOpts.invert = invert;
    if (invert) {
        info(`Running mocha with "--invert" set to "${invert}"`);
        tag = tag.substr(1);
    }

    mochaOpts.grep = createGrep(tag);
    info(`Running mocha with "--grep" set to "${mochaOpts.grep}"`);

    // If we're running in parallel, we need to filter the specs before they get to Mocha.
    // Otherwise, it will spin up a bunch of browsers to run tests that don't match the grep.
    if (isSharded) {
        protractorConf.specs = filterSpecs(protractorConf.specs, tag);
        if (protractorConf.specs.length === 0) {
            info(`No matching specs! 😔`);
            return;
        }
        info(`Only running the following specs:
    ${protractorConf.specs.join('\n    ')}
        `);
    }
}

function filterSpecs (specs, tag) {
    if (process.env[MOCHA_SPECS_SHARDED_FILTERED_KEY]) {
        return specs;
    }

    let files = [];
    specs.forEach(specsGlob => {
        files = [...files, ...glob.sync(specsGlob)];
    });

    const filtered = files.filter(filePath => {
        const contents = fs.readFileSync(filePath, { encoding: 'utf8' });
        const ast = parse(contents);
        const matches = esquery(ast, DESCRIBE_QUERY).filter(match => match.value.match(new RegExp(tag, 'i')));
        return matches.length > 0;
    });
    process.env[MOCHA_SPECS_SHARDED_FILTERED_KEY] = true;
    return filtered;
}

function createGrep (tag) {
    return `/${tag.split(TAG_TOKEN).map(a => a.trim()).map(a => `(?=.*${a}.*)`).join('')}/i`;
}
