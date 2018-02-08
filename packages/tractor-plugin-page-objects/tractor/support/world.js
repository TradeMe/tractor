'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _tractorConfigLoader = require('@tractor/config-loader');

var _tractorDependencyInjection = require('@tractor/dependency-injection');

var _tractorPluginLoader = require('@tractor/plugin-loader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


// Dependencies:


var di = (0, _tractorDependencyInjection.container)();
var plugins = (0, _tractorPluginLoader.getPlugins)();
var config = (0, _tractorConfigLoader.getConfig)();

module.exports = function () {
    var _global = global,
        browser = _global.browser;


    di.constant({ browser: browser, config: config });

    this.World = function () {
        return new CustomWorld();
    };

    return this.World;
};

var CustomWorld = function CustomWorld() {
    _classCallCheck(this, CustomWorld);

    _chai2.default.use(_chaiAsPromised2.default);

    global.By = global.protractor.By;
    global.expect = _chai2.default.expect;
    global.Promise = _bluebird2.default;

    plugins.map(function (plugin) {
        global[plugin.description.variableName] = di.call(plugin.create);
    });
};
