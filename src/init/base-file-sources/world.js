'use strict';

/* eslint-disable no-var, prefer-arrow-callback */

var Promise = require('bluebird');
var tractorConfigLoader = require('tractor-config-loader');
var tractorDependencyInjection = require('tractor-dependency-injection');
var tractorPluginLoader = require('tractor-plugin-loader');

var config = tractorConfigLoader.getConfig();
var di = tractorDependencyInjection.container();
var plugins = tractorPluginLoader.getPlugins();

var CustomWorld = function () {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');

    var CustomWorld = function CustomWorld() {
        global.By = global.protractor.By;
        chai.use(chaiAsPromised);
        global.expect = chai.expect;
        global.Promise = Promise;

        plugins.map(function (plugin) {
            global[plugin.description.variableName] = di.call(plugin.create);
        });
    };

    return CustomWorld;
}();

module.exports = function () {
    var cucumber = this;
    var browser = global.browser;

    di.constant({ browser: browser, config: config, cucumber: cucumber });

    plugins.map(function (plugin) {
        di.call(plugin.addHooks);
    });

    this.World = function () {
        return new CustomWorld();
    };

    /* eslint-disable new-cap */
    this.StepResult(function (stepResult, callback) {
        if (browser) {
            let params = browser.params || {};
            if (stepResult.getStatus() === 'failed' && params.debug === 'true') {
                browser.pause();
            }
        }
        callback();
    });

    /* eslint-disable new-cap */
    this.After(function (scenario) {
        /* eslint-enable new-cap */
        if (browser) {
            browser.manage().deleteAllCookies();
            browser.executeScript('try { window.sessionStorage.clear(); } catch (e) { }');
            browser.executeScript('try { window.localStorage.clear(); } catch (e) { }');
        }

        if (browser && scenario.isFailed()) {
            return Promise.all([takeScreenshot(browser, scenario), printBrowserLog(browser)]);
        } else {
            return Promise.resolve();
        }
    });

    return this.World;
};

function takeScreenshot (browser, scenario) {
    return browser.takeScreenshot().then(function (base64png) {
        var decodedImage = new Buffer(base64png, 'base64');
        scenario.attach(decodedImage, 'image/png');
    });
}

function printBrowserLog (browser) {
    return browser.manage().logs().get('browser').then(function (browserLog) {
        var severeErrors = browserLog.filter(function (log) {
            return log.level.name === 'SEVERE';
        })
        .map(function (log) {
            return log.message.substring(log.message.indexOf('Error'), log.message.indexOf('\n'));
        });

        if (severeErrors) {
            severeErrors.forEach(function (message) {
                console.error(message);
            });
        }
    });
}
