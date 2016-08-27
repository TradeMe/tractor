'use strict';

// Utilities:
import { join } from 'path';

export default {
    COMPONENTS: 'components',
    FEATURES: 'features',
    MOCK_DATA: 'mock-data',
    STEP_DEFINITIONS: 'step-definitions',

    SUPPORT_DIR: 'support',
    REPORT_DIR: 'report',

    WORLD_SOURCE_FILE_PATH: join('base-file-sources', 'world.js'),
    WORLD_FILE_NAME: 'world.js',

    HOOKS_SOURCE_FILE_PATH: join('base-file-sources', 'hooks.js'),
    HOOKS_FILE_NAME: 'hooks.js',

    PROTRACTOR_CONF_SOURCE_FILE_PATH: join('base-file-sources', 'protractor.conf.js'),
    PROTRACTOR_CONF_FILE_NAME: 'protractor.conf.js',

    GET_INSTALLED_DEPENDENCIES_COMMAND: 'npm ls --depth 0',

    INSTALL_DEPENDENCIES_COMMAND: 'npm install --save-dev --save-exact ',

    SELENIUM_UPDATE_COMMAND: `node ${join('node_modules', 'protractor', 'bin', 'webdriver-manager')} update`,

    SERVER_ERROR: 500
};
