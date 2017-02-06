// Constants:
import { DEFAULT_CONFIG } from './default.conf.js';
const CONFIG_FILE_NAME = 'tractor.conf.js';

// Utilites:
import path from 'path';

// Dependencies:
import defaults from 'lodash.defaults';
import minimist from 'minimist';

let config;
export function getConfig () {
    config = config || loadConfig();
    return config;
}

export function loadConfig () {
    let args = minimist(process.argv.slice(2));
    let configPath = path.resolve(process.cwd(), args.config || CONFIG_FILE_NAME);

    let config;
    try {
        config = require(configPath);
        config = config.default ? config.default : config;
    } catch (e) {
        config = {};
    }
    return defaults(config, DEFAULT_CONFIG);
}
