'use strict';

// Plugins:
let tractorPluginLoader = require('@tractor/plugin-loader');
let plugins = tractorPluginLoader.getPlugins();

let protractorConfig = {
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

    SELENIUM_PROMISE_MANAGER: false
};

plugins.forEach(plugin => plugin.plugin(protractorConfig));

exports.config = protractorConfig;
