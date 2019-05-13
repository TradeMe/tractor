# tractor

A UI around [Protractor](http://angular.github.io/protractor/) to help write E2E tests for [Angular](https://angular.io/) applications without needing to know JavaScript

[![Greenkeeper badge](https://badges.greenkeeper.io/TradeMe/tractor.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/@tractor/cli.svg)](https://www.npmjs.com/package/@tractor/cli)
[![Code Climate](https://codeclimate.com/github/TradeMe/tractor/badges/gpa.svg)](https://codeclimate.com/github/TradeMe/tractor)
[![Test Coverage](https://codeclimate.com/github/TradeMe/tractor/coverage.svg)](https://codeclimate.com/github/TradeMe/tractor/coverage)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://github.com/TradeMe/tractor)

This repository contains the code for the underlying infrastructure of tractor, as well as some [plugins](https://www.npmjs.com/org/tractor-plugins) that contain the main functionality.

## Install

To install the cli, add `@tractor/cli` as a dev dependency to your Angular application:

```sh
npm install @tractor/cli -D
```

That will install the CLI, which can then be used inside your application.

## Setup

To get started, you'll need to run the following:

```sh
./node_modules/.bin/tractor init
```

The initialisation can be configured with a `tractor.conf.js` file (described in the Config section).

Once everything has been initialised, you need to start the `tractor` application from the root directory of your app with:

```sh
./node_modules/.bin/tractor start
```

The app should then be available running at [http://localhost:4000](http://localhost:4000). The port can be configured in the `tractor.conf.js` file.

## Config

If you want to change the port that `tractor` runs at, or the different environments you can target, you need to add a `tractor.conf.js` file in the root of your app directory. It might look something like the following:

```javascript
module.exports = {
    port: number,                // defaults to 4000
    environments: Array<string>  // a list of URLs for the environments to run the tests in
};
```

The `tractor.conf.js` file is also used to configure any plugins you have installed.

## Development

To set up development:

```sh
yarn # install dependencies and initialise workspaces
lerna run build # build and test all the packages
```

[More information on `yarn` workspaces](https://yarnpkg.com/en/docs/workspaces).

[More information on `lerna`](https://lernajs.io/).

You can use `lerna` to run commands across all packages, or groups of packages:

```sh
lerna run test # run unit test in all packages
lerna run compile --scope="@tractor-plugins/*" # runs JavaScript compiler in all @tractor-plugin packages
lerna run test:e2e:ci --scope="@tractor/ui" # run end-to-end tests in the @tractor/ui package only
```

