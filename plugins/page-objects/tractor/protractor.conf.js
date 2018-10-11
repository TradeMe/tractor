'use strict';

// Plugins:
var tractorPluginLoader = require('@tractor/plugin-loader');
var plugins = tractorPluginLoader.getPlugins();

var protractorConfig = {
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

plugins.forEach(function (plugin) {
    plugin.plugin(protractorConfig);
});

exports.config = protractorConfig;
