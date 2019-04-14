// Dependencies:
const { tractor } = require('@tractor/core');

exports.config = tractor('../tractor.conf.js').plugin({
    allScriptsTimeout: 11000,
    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 4,
        chromeOptions: {
            args: [
                '--headless',
                '--disable-gpu'
            ]
        }
    },
    directConnect: true,
    mochaOpts: {
        timeout: 30000
    },
    SELENIUM_PROMISE_MANAGER: false
});
