"use strict";

var _configLoader = require("@tractor/config-loader");

var _dependencyInjection = require("@tractor/dependency-injection");

var _pluginLoader = require("@tractor/plugin-loader");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiAsPromised = _interopRequireDefault(require("chai-as-promised"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var di = (0, _dependencyInjection.container)();
var plugins = (0, _pluginLoader.getPlugins)();
var config = (0, _configLoader.getConfig)();

module.exports = function () {
  var _global = global,
      browser = _global.browser;
  di.constant({
    browser: browser,
    config: config
  });

  this.World = function () {
    return new CustomWorld();
  };

  return this.World;
};

var CustomWorld = function CustomWorld() {
  _classCallCheck(this, CustomWorld);

  _chai.default.use(_chaiAsPromised.default);

  global.By = global.protractor.By;
  global.expect = _chai.default.expect;
  global.Promise = _bluebird.default;
  plugins.map(function (plugin) {
    global[plugin.description.variableName] = di.call(plugin.create);
  });
};