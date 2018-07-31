'use strict';

// Dependencies:
const { promisify } = require('bluebird');
const mkdir = promisify(require('fs').mkdir);
const rimraf = promisify(require('rimraf'));

// Plugins:
const tractorPluginLoader = require('@tractor/plugin-loader');
const plugins = tractorPluginLoader.getPlugins();

// Constants:
const TEST_DIRECTORY = './test';

const protractorConfig = {
    allScriptsTimeout: 11000,

    capabilities: {
        browserName: 'chrome'
    },

    directConnect: true,

    params: {
        debug: false
    },

    mochaOpts: {
        timeout: 30000
    },

    plugins: [{
        inline: {
            onPrepare () {
                return rimraf(TEST_DIRECTORY)
                .then(() => mkdir(TEST_DIRECTORY));
            }
        }
    }],

    SELENIUM_PROMISE_MANAGER: false
};

plugins.forEach(function (plugin) {
    plugin.plugin(protractorConfig);
});

exports.config = protractorConfig;
