'use strict';
exports.config = {
    allScriptsTimeout: 11000,
    specs: ['features/**/*.feature'],
    capabilities: { 'browserName': 'chrome' },
    params: { debug: false },
    framework: 'cucumber',
    cucumberOpts: {
        require: [
            'support/**/*.js',
            'step-definitions/**/*.js'
        ],
        format: 'pretty'
    }
};
