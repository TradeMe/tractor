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

To set up development:

```sh
npm install # install dependencies
npm run dev # link dependencies
tractor init
```

To run plugin:

```sh
npm run tractor:test # in one tab
npm run tractor # in another tab
```

To run tests:

```sh
npm run tractor:test # in one tab
npm run test:e2e # in another tab
```
