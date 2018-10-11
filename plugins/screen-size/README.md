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
        md: 768 // When a test is tagged with #md, it will run at 768x1000
    }
};
```

### Within a test

You can also use the `screenSize.setSize` method in a test. It takes a `string` which should be the name of the size from your config, e.g. 'sm' or 'md' with the config from above.

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
