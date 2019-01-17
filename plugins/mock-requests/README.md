# @tractor-plugins/mock-requests

Plugin for [**tractor**](https://github.com/TradeMe/tractor) for mocking HTTP/Fetch requests.

[![npm version](https://img.shields.io/npm/v/@tractor-plugins/mock-requests.svg)](https://www.npmjs.com/package/@tractor-plugins/mock-requests)

## How to install

`npm install @tractor-plugins/mock-requests --dev`

## Configuration

```javascript
// tractor.conf.js
module.exports = {
    // ...
    mockRequests: {
        directory: './path/to/app/',
        domain: 'custom.domain.co.nz',
        headers: {
            'Custom Header': 'Custom Value'
        },
        port: 5000
    },
    // ...
};
```

For more information [see here](./docs/configuration.md)

## What does this plugin do?

When testing an application, it is often useful to use fake API data. This can speed up creating tests, and can also make it faster to run the tests.

This plugin provides a mechanism for intercepting XHR and Fetch requests, and allows you to respond with pre-defined responses, based on the request URL. This is done with a proxy that injects the pre-defined responses into your running app, greatly reducing the overhead of a real request. It also provides a UI for creating **JSON** data files which are used as the response.

You'll probably want to use it with [@tractor-plugins/mocha-specs](https://github.com/phenomnomnominal/tractor-plugin-mocha-specs).

## Development

To set up development, just run `yarn` from the root of the repository. You can then run the following commands from within the directory, or use [`lerna run`](https://github.com/lerna/lerna/tree/master/commands/run) with [`--scope="@tractor-plugins/mock-requests`](https://www.npmjs.com/package/@lerna/filter-options).

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