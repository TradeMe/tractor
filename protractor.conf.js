exports.config = {
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
    chromeDriver: require('chromedriver/lib/chromedriver').path,
    geckoDriver: require('geckodriver/lib/geckodriver').path,
    mochaOpts: {
        timeout: 30000
    },
    directConnect: true,
    SELENIUM_PROMISE_MANAGER: false
};
