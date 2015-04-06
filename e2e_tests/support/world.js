'use strict';

var CustomWorld = (function () {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    var HttpBackend = require('httpbackend');

    var CustomWorld = function CustomWorld () {
        global.browser = global.protractor = require('protractor').getInstance();
        global.httpBackend = new HttpBackend(global.browser, { autoSync: false });
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
    this.After(function(callback) {
    /* eslint-enable new-cap */
        global.httpBackend.reset();
        callback();
    });

    return this.World;
};
