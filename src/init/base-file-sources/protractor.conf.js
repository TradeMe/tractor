let protractorConfig = {
    allScriptsTimeout: 11000,

    capabilities: {
        browserName: 'chrome'
    },

    directConnect: true,

    params: { debug: false }
};

exports.config = protractorConfig;
