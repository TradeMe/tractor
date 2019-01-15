// Dependencies:
const { promisify } = require('bluebird');
const mkdir = promisify(require('fs').mkdir);
const rimraf = promisify(require('rimraf'));

// Constants:
const TEST_DIRECTORY = './test';

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
    plugins: [{
        inline: {
            onPrepare () {
                return rimraf(TEST_DIRECTORY)
                .then(() => mkdir(TEST_DIRECTORY));
            }
        }
    }],
    SELENIUM_PROMISE_MANAGER: false
});
