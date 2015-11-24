# tractor - v0.6.10

A UI around [Gherkin](http://cukes.info/gherkin.html) & [Protractor](http://angular.github.io/protractor/) to help write E2E tests for [Angular](https://angularjs.org/) applications without needing to know JavaScript.

# Install:

To use it with an Angular app, run the following:

    npm install -g tractor

That will install the global binary, which will allow you to run the `tractor` command from anywhere.

From there, you should navigate to the root directory of your Angular app and run:

    tractor init

That sets up the test directory structure, installs some dependencies, and sets up [Selenium](http://www.seleniumhq.org/).
The initialisation can be configured with a `tractor.conf.js` file (described in the Config section).

Once everything has been initialised, you need to start the `tractor` application from the root directory of your app with:

    tractor start

The app should then be available running at [http://localhost:4000](http://localhost:4000). The port can be configured in the `tractor.conf.js` file.

# Config:

If you want to change the port that `tractor` runs at, or the file where it stores the generated files, you need to add a `tractor.conf.js` file in the root of your app directory, which should look something like the following:

    'use strict';

    module.exports = {
        testDirectory: 'path/to/test/directory', // defaults to root/e2e-tests
        port: number,                            // defaults to 4000
        environments: Array<string>,             // a list of URLs for the environments to run the tests in
        beforeProtractor: function,              // a function to run before protractor runs
        afterProtractor: function                // a function to run after protractor runs
    };
