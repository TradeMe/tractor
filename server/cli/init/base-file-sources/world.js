'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var HttpBackend = require('httpbackend');
var _ = require("lodash");

var CustomWorld = (function () {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    var CustomWorld = function CustomWorld () {
        global.By = global.protractor.By;
        chai.use(chaiAsPromised);
        global.expect = chai.expect;
        global.Promise = require('bluebird');
    };

    return CustomWorld;
})();

module.exports = function () {
    this.World = function (callback) {
        var w = new CustomWorld();
        return callback(w);
    };

    /* eslint-disable new-cap */
    this.Before(function (callback) {
    /* eslint-enable new-cap */
        global.httpBackend = new HttpBackend(global.browser);
        callback();
    });

    /* eslint-disable new-cap */
    this.After(function (scenario, callback) {
        var browserlogArray = [];
        var message;
    /* eslint-enable new-cap */
        global.httpBackend.clear();
        global.browser.manage.deleteAllCookies();
        global.browser.executeScript('window.sessionStorage.clear();');
        global.browser.executeScript('window.localStorage.clear();');
        if (scenario.isFailed()) {
            global.browser.takeScreenshot().then(function (base64png) {
                var decodedImage = new Buffer(base64png, 'base64').toString('binary');
                scenario.attach(decodedImage, 'image/png', callback);
            }, function (err) {
                callback(err);
            })
            global.browser.manage().logs().get('browser').then(function (browserlog) {
                browserlog.forEach(function (log) {
                    if (log.level.name === 'SEVERE') {
                        message = log.message.substring(log.message.indexOf('Error'), log.message.indexOf('\n'));
                        browserlogArray.push(message);
                    }
                })
                if (browserlogArray.length > 0) {
                    console.log("Browser Console log: {level: 'SEVERE'}: ");
                    browserlogArray = _.compact(_.unique(browserlogArray));
                    browserlogArray.forEach(function (mssg) {
                        console.error(mssg);
                    })
                }
            })
        } else {
            callback();
        }
    });

    return this.World;
};