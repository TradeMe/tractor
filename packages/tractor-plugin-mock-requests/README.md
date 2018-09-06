# @tractor-plugins/mock-requests

Plugin for [**tractor**](https://github.com/TradeMe/tractor) for mocking HTTP/Fetch requests.

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-plugin-mock-requests.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/@tractor-plugins/mock-requests.svg)](https://www.npmjs.com/package/@tractor-plugins/mock-requests)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/tractor-plugin-mock-requests/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-plugin-mock-requests)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/tractor-plugin-mock-requests/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-plugin-mock-requests/coverage)

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

You'll probably want to us it with [@tractor-plugins/mocha-specs](https://github.com/phenomnomnominal/tractor-plugin-mocha-specs).

## Development

To set up development:

```sh
npm install # install dependencies
npm run dev # link dependencies
tractor init
```

To run plugin...

```sh
npm run tractor:test # in one tab
npm run tractor # in another tab
```

To run tests...

```sh
npm run tractor:test # in one tab
npm run test:e2e # in another tab
```
