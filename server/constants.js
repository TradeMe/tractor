'use strict';

module.exports = {
    FEATURES_EXTENSION: '.feature',
    FEATURES_DIR: 'features',

    STEP_DEFINITIONS_EXTENSION: '.step.js',
    STEP_DEFINITIONS_DIR: 'step_definitions',

    COMPONENTS_EXTENSION: '.component.js',
    COMPONENTS_DIR: 'components',

    SUPPORT_DIR: 'support',

    WORLD_SOURCE_FILE_PATH: './base_file_sources/world.js',
    WORLD_FILE_NAME: 'world.js',

    PROTRACTOR_CONF_SOURCE_FILE_PATH: './base_file_sources/protractor.conf.js',
    PROTRACTOR_CONF_FILE_NAME: 'protractor.conf.js',

    SELENIUM_UPDATE_COMMAND: 'node node_modules/protractor/bin/webdriver-manager update',

    CUCUMBER_COMMAND: 'node node_modules/cucumber/bin/cucumber ',

    GHERKIN_NEWLINE: '%%NEWLINE%%'
};
