// Constants:
import defaultConfig from './default.conf.js';
const CONFIG_FILE_NAME = 'tractor.conf.js';

// Utilites:
import path from 'path';

// Dependencies:
import defaults from 'lodash.defaults';
import commander from 'commander';

class TractorConfigLoader {
    loadConfig () {
        commander.option('-c, --config <path>').parse(process.argv);

        let configPath = path.resolve(process.cwd(), commander.config || CONFIG_FILE_NAME);

        let config;
        try {
            config = require(configPath);
            config = config.default ? config.default : config;
        } catch (e) {
            config = {};
        }
        return defaults(config, defaultConfig);
    }
}

let tractorConfigLoader = new TractorConfigLoader();
export default tractorConfigLoader;
