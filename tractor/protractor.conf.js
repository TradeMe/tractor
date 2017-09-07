'use strict';

exports.config = {
    allScriptsTimeout: 11000,

    capabilities: {
        browserName: 'chrome'
    },

    directConnect: true,

    params: { debug: false },

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    specs: ['features/**/*.feature'],
    cucumberOpts: {
        require: ['support/**/*.js', 'step-definitions/**/*.js'],
        format: 'pretty',
        tags: []
    }
};
