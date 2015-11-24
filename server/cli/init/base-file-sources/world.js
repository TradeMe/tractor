'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var HttpBackend = require('httpbackend');

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
    this.After(function (callback) {
    /* eslint-enable new-cap */
        global.httpBackend.clear();
        global.browser.manage.deleteAllCookies();
        global.browser.executeScript('window.sessionStorage.clear();');
        global.browser.executeScript('window.localStorage.clear();');
        callback();
    });

    return this.World;
};
