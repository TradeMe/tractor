// Constants:
import { DEFAULT_CONFIG } from './default.conf.js';
const CONFIG_FILE_NAME = 'tractor.conf.js';
const EMPTY_TAG = '';

// Utilites:
import path from 'path';
import { info } from 'tractor-logger';

// Dependencies:
import defaults from 'lodash.defaults';
import minimist from 'minimist';

let config;
export function getConfig () {
    config = config || loadConfig();
    return config;
}

export function loadConfig () {
    info('Loading config...');
    let args = minimist(process.argv.slice(2));
    let configPath = path.resolve(process.cwd(), args.config || CONFIG_FILE_NAME);

    let config;
    try {
        config = require(configPath);
        config = config.default ? config.default : config;
    } catch (e) {
        config = {};
    }
    config = defaults(config, DEFAULT_CONFIG);

    sortTags(config);
    return config;
}

function sortTags (config) {
    // Remove empty tag
    if (config.tags.includes(EMPTY_TAG)) {
        let index = config.tags.indexOf(EMPTY_TAG);
        config.tags.splice(index, 1);
    }

    // Add @s
    config.tags = config.tags.map(tag => tag.startsWith('@') ? tag : `@${tag}`);

    // Add empty tag to start
    config.tags.unshift(EMPTY_TAG);
}
