'use strict';

/* eslint-disable no-var*/
var constants = require('../../../constants')
var cucumber = require('cucumber');
var cucumberHtmlReport = require('cucumber-html-report');
var log = require('npmlog');
var moment = require('moment');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));


function createReporter () {
    /* eslint-disable new-cap */
    var jsonFormatter = cucumber.Listener.JsonFormatter();
    var outputDir = path.join(__dirname, '../', constants.REPORT_DIR)
    jsonFormatter.log = jsonReportWriter;
    return jsonFormatter;

    function jsonReportWriter (content) {
        var jsonFileName = getFileName('cucumberReport_', 'json');
        var cucumberReport = path.join(outputDir, jsonFileName);
        fs.writeFileAsync(cucumberReport, content)
        .then(() => htmlReportWriter(cucumberReport))
         /* eslint-disable prefer-template */
        .catch((error) => log.error('Failed to save test results to json file. ' + error));
    }

    function htmlReportWriter (cucumberReport) {
        var htmlFileName = getFileName('tractorReport_', 'html');
        var report = new cucumberHtmlReport({
            source: cucumberReport,
            dest: outputDir,
            name: htmlFileName
        });
        report.createReport();
    }

    function getFileName (file, extension) {
        var reportTimestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
        /* eslint-disable prefer-template */
        return file + reportTimestamp + '.' + extension;
    }
}

module.exports = function () {
    var reporter = createReporter();
    this.registerListener(reporter);
};
