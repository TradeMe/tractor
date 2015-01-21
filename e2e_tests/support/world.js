var CustomWorld = (function () {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');

    var CustomWorld = function CustomWorld () {
        browser = protractor = require('protractor').getInstance();
        By = protractor.By;
        chai.use(chaiAsPromised);
        expect = chai.expect;
        Promise = require('bluebird');
    };

    return CustomWorld;
})();

module.exports = function () {
    return this.World = function (callback) {
        var w = new CustomWorld();
        return callback(w);
    };
};
