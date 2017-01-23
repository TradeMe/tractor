'use strict';

exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'features/**/*.feature'
    ],

    capabilities: {
        browserName: 'chrome'
    },

    directConnect: true,

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        require: ['support/**/*.js', 'step-definitions/**/*.js'],
        format: 'pretty',
        tags: []
    },

    params: { debug: false },
};
