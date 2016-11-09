'use strict';

exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'features/**/*.feature'
    ],

    capabilities: {
        browserName: 'chrome'
    },

    params: {
        debug: false
    },

    directConnect: true,

    framework: 'cucumber',

    // onPrepare: function() {
    //     browser.driver.manage().window().maximize();

    //     var disableNgAnimate = function() {
    //         angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
    //             $animate.enabled(false);
    //         }]);
    //     };

    //     browser.addMockModule('disableNgAnimate', disableNgAnimate);
    // },

    cucumberOpts: {
        require: ['support/**/*.js', 'step-definitions/**/*.js'],
        format: 'pretty',
        tags: []
    }
};
