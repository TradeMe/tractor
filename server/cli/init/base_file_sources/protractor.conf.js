'use strict';

exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'features/**/*.feature'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    framework: 'cucumber',

    cucumberOpts: {
        require: ['support/**/*.js', 'step_definitions/**/*.js'],
        format: 'pretty'
    }
};
