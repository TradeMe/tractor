"use strict";

var _configLoader = require("@tractor/config-loader");

var _cucumber = require("cucumber");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Dependencies:
module.exports = function () {
  var tmpReportsDirPath = getTmpReportsDirPath();
  this.registerListener(createReporter(tmpReportsDirPath));
};

function createReporter(tmpReportsDirPath) {
  var jsonFormatter = _cucumber.Listener.JsonFormatter();

  jsonFormatter.log = jsonReportWriter;
  return jsonFormatter;

  function jsonReportWriter(content) {
    if (content === JSON.stringify([])) {
      return null;
    }

    var reportName = "cucumber.".concat(Date.now(), ".json");

    try {
      _fs.default.writeFileSync(_path.default.join(tmpReportsDirPath, reportName), content);
    } catch (e) {
      /* eslint-disable no-console */
      console.error('Failed to save test results to json file.');
      console.error(e.message);
      /* eslint-enable no-console */

      throw e;
    }
  }
}

function getTmpReportsDirPath() {
  var tractorConfig = (0, _configLoader.getConfig)();

  var reportsDirPath = _path.default.join(process.cwd(), tractorConfig.cucumber.reportsDirectory);

  return _path.default.join(reportsDirPath, 'tmp-json-reports');
}