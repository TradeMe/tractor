# @tractor-plugins/screen-size

Plugin for [tractor](http://github.com/TradeMe/tractor) for running tests at different screen sizes.

[![npm version](https://img.shields.io/npm/v/@tractor-plugins/screen-size.svg)](https://www.npmjs.com/package/@tractor-plugins/screen-size)

## How to use

### As config

You can add a `screenSizes` property to your "tractor.conf.js" file. Each size can be used as a tag which will resize the browser before your test runs.

```javascript
module.exports = {
    screenSizes: {
        sm: { width: 360, height: 480 }, // When a test is tagged with #sm, it will run at 360x840
        md: 768, // When a test is tagged with #md, it will run at 768x1000
        lg: 'maximise' // When a test is tagged with #lg, it will run at max browser size
        default: 'lg' // When a test is not taggged, if will use the `lg` configuration and run at max browser size
    }
};
```

### Within a test

You can also use the `screenSize.setSize` method in a test. It takes a `string` which should be the name of the size from your config, e.g. 'sm' or 'md' with the config from above.

## Development

To set up development, just run `yarn` from the root of the repository. You can then run the following commands from within the directory, or use [`lerna run`](https://github.com/lerna/lerna/tree/master/commands/run) with [`--scope="@tractor-plugins/screen-size`](https://www.npmjs.com/package/@lerna/filter-options).

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
