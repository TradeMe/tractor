'use strict';

// Constants:
import defaultConfig from './default.conf.js';

// Utilities:
import _ from 'lodash';
import { join } from 'path';

export default createConfig();

export function createConfig () {
    let configPath = join(process.cwd() + '/tractor.conf.js');
    let config;
    try {
        config = require(configPath);
    } catch (e) {
        config = {};
    }
    return _.defaults(config, defaultConfig);
}
