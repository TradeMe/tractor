// Dependencies:
const { tractor } = require('@tractor/core');

exports.config = tractor('../tractor.conf.js').plugin({
    allScriptsTimeout: 30000,
    getPageTimeout: 30000,
    multiCapabilities: [{
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 2,
        chromeOptions: {
            args: [
                '--headless',
                '--disable-gpu'
            ]
        }
    }],
    mochaOpts: {
        timeout: 30000
    },
    directConnect: true,
    SELENIUM_PROMISE_MANAGER: false
});
