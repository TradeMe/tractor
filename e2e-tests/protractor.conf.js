'use strict';
exports.config = {
    allScriptsTimeout: 11000,
    specs: ['features/**/*.feature'],
    capabilities: { 'browserName': 'chrome' },
    params: { debug: false, runAtMobileSize: false },
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        require: [
            'support/**/*.js',
            'step-definitions/**/*.js'          
        ],        
        format: 'pretty',
        tags: []
    },
    onPrepare: function() {
        console.log(browser.params);
	    //var RUN_AT_MOBILE_SIZE = false;

        if (browser.params.runAtMobileSize) {
			browser.driver.manage().window().setSize(340, 1050);
			var origFn = browser.driver.controlFlow().execute;
			browser.driver.controlFlow().execute = function() {
				var args = arguments;
				// queue 100ms wait leave this line commented out
				origFn.call(browser.driver.controlFlow(), function() {
					return protractor.promise.delayed(100);
				});
				return origFn.apply(browser.driver.controlFlow(), args);
			};
		} else {
			browser.driver.manage().window().maximize();
		}
    }
};
