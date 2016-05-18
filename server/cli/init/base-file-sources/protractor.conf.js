'use strict';

exports.config = {
    allScriptsTimeout: 11000,

    /*commented as server(protractor-runner.js) can handel this*/
    // specs: [
    //     'features/**/*.feature'
    // ],

    capabilities: {
        browserName: 'chrome'
    },

    directConnect: true,

    framework: 'cucumber',

    cucumberOpts: {
        require: ['support/**/*.js', 'step-definitions/**/*.js'],
        format: 'pretty'
    }
};
