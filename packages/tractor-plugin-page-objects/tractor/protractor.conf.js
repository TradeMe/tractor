'use strict';

// Dependencies:
let { promisify } = require('bluebird');
let mkdir = promisify(require('fs').mkdir);
let rimraf = promisify(require('rimraf'));

// Plugins:
var tractorPluginLoader = require('@tractor/plugin-loader');
var plugins = tractorPluginLoader.getPlugins();

// Constants:
const TEST_DIRECTORY = './test';

var protractorConfig = {
    allScriptsTimeout: 11000,

    capabilities: {
        browserName: 'chrome'
    },

    directConnect: true,

    params: {
        debug: false
    },

    plugins: [{
        inline: {
            onPrepare () {
                return rimraf(TEST_DIRECTORY)
                .then(() => mkdir(TEST_DIRECTORY));
            }
        }
    }]
};

plugins.forEach(function (plugin) {
    plugin.plugin(protractorConfig);
});

exports.config = protractorConfig;
