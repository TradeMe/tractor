var TIMEOUT = 40000;

exports.config = {
    allScriptsTimeout: TIMEOUT,
    getPageTimeout: TIMEOUT,
    multiCapabilities: [{
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 2
    }, {
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
        timeout: TIMEOUT
    },
    directConnect: true,
    SELENIUM_PROMISE_MANAGER: false
};
