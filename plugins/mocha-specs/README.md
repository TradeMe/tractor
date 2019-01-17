# @tractor-plugins/mocha-specs

Plugin for [**tractor**](https://github.com/TradeMe/tractor) for creating E2E tests with [**Mocha**](https://mochajs.org/).

[![npm version](https://img.shields.io/npm/v/@tractor-plugins/mocha-specs.svg)](https://www.npmjs.com/package/@tractor-plugins/mocha-specs)

## How to install

```sh
npm install @tractor-plugins/mocha-specs --dev
```

## Config

```javascript
// tractor.conf.js
module.exports = {
    // ...
    mochaSpecs: {

    },
    // ...
};
```

For more information [see here](./docs/configuration.md)

## Development

To set up development, just run `yarn` from the root of the repository. You can then run the following commands from within the directory, or use [`lerna run`](https://github.com/lerna/lerna/tree/master/commands/run) with [`--scope="@tractor-plugins/mocha-specs`](https://www.npmjs.com/package/@lerna/filter-options).

### Build

To build the whole package:

```sh
yarn build
```

### Test

To run unit tests:

```sh
yarn test
yarn cover # with coverage
```

To run end-to-end tests:

```sh
yarn tractor:test # in one tab
yarn test:e2e # in another tab
```

To run end-to-end tests in CI mode:

```sh
yarn test:e2e:ci # handles the starting and killing of the application for testing
```

To start `tractor`:

```sh
yarn tractor
```