'use strict';

module.exports = function () {
    this.StepResult(function (stepResult, callback) {
        var browser = global.browser;
        if (browser) {
            var params = browser.params || {};
            if (stepResult.getStatus() === 'failed' && params.debug === 'true') {
                browser.pause();
                browser.explore();
            }
        }
        callback();
    });
};