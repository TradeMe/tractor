// Constants:
import { DEFAULT_CONFIG } from './default.conf.js';
const CONFIG_FILE_NAME = 'tractor.conf.js';

// Utilites:
import path from 'path';
import { info } from '@tractor/logger';

// Dependencies:
import defaults from 'lodash.defaults';

let config;
export function getConfig (configPath) {
    config = config || loadConfig(configPath);
    return config;
}

export function loadConfig (configPath = CONFIG_FILE_NAME) {
    info('Loading config...');
    configPath = path.resolve(process.cwd(), configPath);

    let config;
    try {
        config = require(configPath);
        config = config.default ? config.default : config;
    } catch (e) {
        config = {};
    }
    config = defaults(config, DEFAULT_CONFIG);

    return config;
}
