exports.config = require('@tractor/plugin-loader').plugin({
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
  });
  