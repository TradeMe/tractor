# @tractor-plugins/browser

Plugin for [tractor](http://github.com/TradeMe/tractor) that contains a subset of [Protractor](http://www.protractortest.org/#/api)
browser methods.

[![npm version](https://img.shields.io/npm/v/@tractor-plugins/browser.svg)](https://www.npmjs.com/package/@tractor-plugins/browser)

## Currently implemented methods

* [`browser.get`](http://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.get)
* [`browser.refresh`](http://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.refresh)
* [`browser.setLocation`](http://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.setLocation)
* [`browser.getCurrentUrl`](http://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.getCurrentUrl)
* [`browser.waitForAngular`](http://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.waitForAngular)
* [`browser.pause`](http://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.pause)

## Custom helper methods

* `browser.sendEnterKey`
* `browser.sendDeleteKey`

## Development

To set up development, just run `yarn` from the root of the repository. You can then run the following commands from within the directory, or use [`lerna run`](https://github.com/lerna/lerna/tree/master/commands/run) with [`--scope="@tractor-plugins/browser`](https://www.npmjs.com/package/@lerna/filter-options).

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
