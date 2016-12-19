'use strict';
exports.config = {
    allScriptsTimeout: 11000,
    specs: ['features/**/*.feature'],
    capabilities: { 'browserName': 'chrome' },
    params: { debug: false },
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        require: [
            'support/**/*.js',
            'step-definitions/**/*.js'          
        ],        
        format: 'pretty',
        tags: []
    }
};
