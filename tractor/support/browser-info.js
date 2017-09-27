'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
    this.After(function (scenario) {
        var browser = global.browser;
        if (browser && scenario.isFailed()) {
            return _bluebird2.default.all([printBrowserLog(browser), takeScreenshot(browser, scenario)]);
        } else {
            return _bluebird2.default.resolve();
        }
    });
}; // Dependencies:


function printBrowserLog(browser) {
    return browser.manage().logs().get('browser').then(function (browserLog) {
        browserLog.filter(function (log) {
            return log.level.name === 'SEVERE';
        }).forEach(function (log) {
            /* eslint-disable no-console */
            console.error(log.message);
            /* eslint-enable no-console */
        });
    });
}

function takeScreenshot(browser, scenario) {
    return browser.takeScreenshot().then(function (base64png) {
        var decodedImage = new Buffer(base64png, 'base64');
        scenario.attach(decodedImage, 'image/png');
    });
}
