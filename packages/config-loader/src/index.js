// Constants:
import { DEFAULT_CONFIG } from './default.conf.js';
const CONFIG_FILE_NAME = 'tractor.conf.js';

// Utilites:
import path from 'path';
import { info } from '@tractor/logger';

// Dependencies:
import defaults from 'lodash.defaults';

// Errors:
import { TractorError } from '@tractor/error-handler';

let config;
export function getConfig () {
    if (!config) {
        throw new TractorError(`
            You must call \`loadConfig()\` before you can use \`getConfig()\`!

            Example:

                import { loadConfig } from '@tractor/config-loader';

                const config = loadConfig(process.cwd(), 'path/to/my/config');
        `);
    }
    return config;
}

export function loadConfig (cwd, configPath = CONFIG_FILE_NAME) {
    info('Loading config...');
    const fullConfigPath = path.resolve(cwd, configPath);

    try {
        config = require(fullConfigPath);
        config = config.default ? config.default : config;
    } catch (e) {
        config = {};
    }
    config = defaults(config, DEFAULT_CONFIG);
    config.cwd = cwd;

    return config;
}
