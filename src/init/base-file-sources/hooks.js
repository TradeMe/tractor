'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var cucumber = require('cucumber');
var cucumberHtmlReporter = require('cucumber-html-reporter');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));


function createReporter () {
    /* eslint-disable new-cap */
    var jsonFormatter = cucumber.Listener.JsonFormatter();
    var outputDir = path.join(__dirname, '../', 'report')
    jsonFormatter.log = jsonReportWriter;
    return jsonFormatter;

    function jsonReportWriter (content) {
        var jsonFileName = getFileName('cucumberReport_', 'json');
        var cucumberReport = path.join(outputDir, jsonFileName);
        fs.writeFileAsync(cucumberReport, content)
         /* eslint-disable prefer-arrow-callback */
        .then(function () {
            return htmlReportWriter(outputDir, jsonFileName);
        })
         /* eslint-disable prefer-template */
        .catch(function (error) {
            console.log('Failed to save test results to json file. ' + error);
        });
    }

    function htmlReportWriter (outputDir, jsonFileName) {
        var htmlFileName = getFileName('tractorReport_', 'html');
        var cucumberhtmlReport = path.join(outputDir, htmlFileName);
        var cucumberJsonReport = path.join(outputDir, jsonFileName);
        var options = {
            theme: 'bootstrap',
            jsonFile: cucumberJsonReport,
            output: cucumberhtmlReport,
            reportSuiteAsScenarios: true,
            launchReport: true
        };

        cucumberHtmlReporter.generate(options);
    }

    function getFileName (file, extension) {
        /* eslint-disable prefer-template */
        return file + new Date().toLocaleString().replace(/[\/\\:]/g, '-') + '.' + extension;
    }
}

module.exports = function () {
    var reporter = createReporter();
    this.registerListener(reporter);
};
