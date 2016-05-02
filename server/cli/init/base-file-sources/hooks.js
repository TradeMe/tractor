'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var constants = require('../../../constants')
var cucumber = require('cucumber');
var path = require('path');
var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));
 /* eslint-disable new-cap */
var jsonReportFormatter = cucumber.Listener.JsonFormatter();
var outputDir = path.join(__dirname, '../', constants.REPORT_DIR)

jsonReportFormatter.log = function (string) {
    var cucumberReport = path.join(outputDir, 'cucumber_report.json');
    fs.writeFile(cucumberReport, string, function (err) {
        if (err) {
            console.log('EError:Failed to save test results to json file.');
            console.log(err);
        } else {
            createHtmlReport(cucumberReport);
        }
    });
};

function createHtmlReport (sourceJson) {
    var CucumberHtmlReport = require('cucumber-html-report');
    var report = new CucumberHtmlReport({
        source: sourceJson, // source json
        dest: outputDir, // target directory (will create if not exists)
        name: 'tractor_report.html'  // report file name (will be index.html if not exists)
    });
    report.createReport();
}

module.exports = function () {
    this.registerListener(jsonReportFormatter);
};
