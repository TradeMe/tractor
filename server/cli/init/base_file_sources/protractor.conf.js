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
        require: ['%%SUPPORT%%/**/*.js', '%%STEP_DEFINITIONS%%/**/*.js'],
        format: 'pretty'
    }
};
