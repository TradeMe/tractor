// Constants:
const CONFIG_FILE_NAME = 'tractor.conf.js';

// Utilites:
import { info } from '@tractor/logger';
import * as path from 'path';

// Dependencies:
import { DEFAULT_TRACTOR_CONFIG } from './default.conf';
import { TractorConfig, TractorConfigESM, TractorConfigInternal, TractorConfigModule } from './tractor-config';

// Errors:
import { TractorError } from '@tractor/error-handler';

let config: TractorConfigInternal;
export function getConfig (): TractorConfigInternal {
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

export function loadConfig (cwd: string, configPath: string = CONFIG_FILE_NAME): TractorConfigInternal {
    info('Loading config...');
    const fullConfigPath = path.resolve(cwd, configPath);

    let userConfig: TractorConfig;
    try {
        const loadedConfig = require(fullConfigPath) as TractorConfigModule;
        userConfig = isESM(loadedConfig) ? loadedConfig.default : loadedConfig;
    } catch (e) {
        userConfig = {};
    }

    config = { ...DEFAULT_TRACTOR_CONFIG, ...userConfig } as TractorConfigInternal;
    config.cwd = cwd;

    return config;
}

function isESM (userConfig: TractorConfigModule): userConfig is TractorConfigESM {
    return !!(userConfig as TractorConfigESM).default;
}
