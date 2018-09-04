# tractor

A UI around [Protractor](http://angular.github.io/protractor/) to help write E2E tests for [Angular](https://angular.io/) applications without needing to know JavaScript

[![Greenkeeper badge](https://badges.greenkeeper.io/TradeMe/tractor.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor.svg)](https://www.npmjs.com/package/tractor)
[![Code Climate](https://codeclimate.com/github/TradeMe/tractor/badges/gpa.svg)](https://codeclimate.com/github/TradeMe/tractor)
[![Test Coverage](https://codeclimate.com/github/TradeMe/tractor/coverage.svg)](https://codeclimate.com/github/TradeMe/tractor/coverage)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://github.com/TradeMe/tractor)

## Install:

To install the cli, run the following:

```
npm install -g @tractor/cli
```

That will install the global binary, which will allow you to run the `tractor` command from anywhere.

From there, you should navigate to the root directory of your Angular app and run:

```
tractor init
```

That sets up the test directory structure, installs some dependencies, and sets up [Selenium](http://www.seleniumhq.org/).
The initialisation can be configured with a `tractor.conf.js` file (described in the Config section).

Once everything has been initialised, you need to start the `tractor` application from the root directory of your app with:

```
tractor start
```

The app should then be available running at [http://localhost:4000](http://localhost:4000). The port can be configured in the `tractor.conf.js` file.

## Config:

If you want to change the port that `tractor` runs at, or the file where it stores the generated files, you need to add a `tractor.conf.js` file in the root of your app directory, which should look something like the following:

```javascript
module.exports = {
    directory: './path/to/test/directory', // defaults to root/tractor
    port: number,                          // defaults to 4000
    environments: Array<string>            // a list of URLs for the environments to run the tests in
};
```
