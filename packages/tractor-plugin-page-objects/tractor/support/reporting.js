'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cucumber = require('cucumber');

var _tractorConfigLoader = require('@tractor/config-loader');

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

        var reportName = 'cucumber.' + Date.now() + '.json';
        try {
            _fs2.default.writeFileSync(_path2.default.join(tmpReportsDirPath, reportName), content);
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
    var tractorConfig = (0, _tractorConfigLoader.getConfig)();
    var reportsDirPath = _path2.default.join(process.cwd(), tractorConfig.cucumber.reportsDirectory);
    return _path2.default.join(reportsDirPath, 'tmp-json-reports');
}
