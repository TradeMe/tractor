'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var constants = require('../../../constants')
var cucumber = require('cucumber');
var cucumberHtmlReport = require('cucumber-html-report');
var log = require('npmlog');
var moment = require('moment');
var path = require('path');
var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));
 /* eslint-disable new-cap */
var jsonFormatter = cucumber.Listener.JsonFormatter();
var outputDir = path.join(__dirname, '../', constants.REPORT_DIR)


function createFileName (file, extension) {
    /* eslint-disable prefer-template */
    return file + moment().format('YYYY-MM-DD_HH-mm-ss') + '.' + extension;
}

function createHtmlReport (sourceJson) {
    var htmlFileName = createFileName('tractorReport_', 'html');
    var report = new cucumberHtmlReport({
        source: sourceJson,
        dest: outputDir,
        name: htmlFileName
    });
    report.createReport();
}

jsonFormatter.log = function (content) {
    var jsonFileName = createFileName('cucumberReport_', 'json');
    var cucumberJsonReport = path.join(outputDir, jsonFileName);
    fs.writeFileAsync(cucumberJsonReport, content)
    .then(() => createHtmlReport(cucumberJsonReport))
     /* eslint-disable prefer-template */
    .catch((error) => log.error('Error:Failed to save test results to json file. ' + error));
};

module.exports = function () {
    this.registerListener(jsonFormatter);
};
