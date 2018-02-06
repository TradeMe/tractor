'use strict';

module.exports = function () {
    this.StepResult(function (step, callback) {
        var browser = global.browser || {};
        var params = browser.params || {};
        if (params.debug === 'true' && step.getStatus() === 'failed') {
            browser.pause();
            browser.explore();
        }
        callback();
    });
};
