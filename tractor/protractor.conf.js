var tractorPluginLoader = require('@tractor/plugin-loader');

var protractorConfig = {
    allScriptsTimeout: 11000,

    capabilities: {
        browserName: 'chrome'
    },

    directConnect: true,

    params: {
        debug: false
    },

    SELENIUM_PROMISE_MANAGER: false
};

exports.config = tractorPluginLoader.plugin(protractorConfig);
