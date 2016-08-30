// Constants:
import defaultConfig from './default.conf.js';
const CONFIG_FILE_NAME = 'tractor.config.js';

// Dependencies:
import defaults from 'lodash.defaults';
import * as findUp from 'find-up';

export function loadConfig () {
    let configPath = findUp.sync(CONFIG_FILE_NAME, { cwd: __dirname });
    let config;
    try {
        config = require(configPath);
    } catch (e) {
        config = {};
    }
    return defaults(config, defaultConfig);
}
