'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var path = require('path');
var cucumber = require('cucumber');
var constants = require('../../../constants')
var outputDir = path.join(__dirname, '../', constants.REPORT_DIR)
var fs = require('fs');
 /* eslint-disable new-cap */
var jsonFormatter = cucumber.Listener.JsonFormatter();


var tractorReportHook = function () {

    var createHtmlReport = function (sourceJson) {
        var CucumberHtmlReport = require('cucumber-html-report');
        var report = new CucumberHtmlReport({
            source: sourceJson, // source json
            dest: outputDir, // target directory (will create if not exists)
            name: 'tractor_report.html'  // report file name (will be index.html if not exists)
        });
        report.createReport();
    };

    jsonFormatter.log = function (string) {
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

    this.registerListener(jsonFormatter);

};

module.exports = tractorReportHook;
