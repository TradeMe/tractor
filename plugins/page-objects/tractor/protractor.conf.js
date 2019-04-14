// Dependencies:
const { tractor } = require('@tractor/core');

exports.config = tractor('../tractor.conf.js').plugin({
    allScriptsTimeout: 11000,
    capabilities: {
        browserName: 'chrome',
        // Explicitly turning off parallelism as these tests break 😔
        shardTestFiles: false
        // These tests won't work in headless 😔
    },
    directConnect: true,
    mochaOpts: {
        timeout: 30000
    },
    SELENIUM_PROMISE_MANAGER: false
});
