# @tractor-plugins/page-objects

Plugin for [**tractor**](https://github.com/TradeMe/tractor) for creating [**Page Objects**](https://github.com/SeleniumHQ/selenium/wiki/PageObjects).

[![npm version](https://img.shields.io/npm/v/@tractor-plugins/page-objects.svg)](https://www.npmjs.com/package/@tractor-plugins/page-objects)

## How to install

```sh
npm install @tractor-plugins/page-objects --dev
```

## Config

```javascript
// tractor.conf.js
module.exports = {
    // ...
    pageObjects: {
        directory: './path/to/app/',
        include: {
            someUiComponentLibrary: './node_modules/module/to/include/existing/page-objects/from/'
        }
    },
    // ...
};
```

For more information [see here](./docs/configuration.md)∏

## What does this plugin do?

A **Page Object** is a class that describes the behaviour of a part of a application. There has been a [lot](https://github.com/SeleniumHQ/selenium/wiki/PageObjects) [of](https://martinfowler.com/bliki/PageObject.html) [stuff](https://www.pluralsight.com/guides/software-engineering-best-practices/getting-started-with-page-object-pattern-for-your-selenium-tests) written about them already! This plugin encapsulates the best ideas of Page Objects and makes it really, really easy to create and modify them.

A **Page Object** is composed of **Elements** and **Actions**. An **Element** is a reference to a DOM element, or group of DOM elements, and an **Action** is a set of **Interactions** on those elements.

This plugin provides a UI for describing **Page Object** classes with **Elements** and **Actions** and generates the corresponding JavaScript code for that class. As an example, the following is generated JavaScript that describes following piece of UI:

![tractor-page-objects action parameter](https://github.com/phenomnomnominal/tractor-plugin-page-objects/tree/master/docs/assets/tractor-page-objects%20action%20parameter.png)

```javascript
/*{"name":"tractor-page-objects action parameter","elements":[{"name":"name input"},{"name":"remove parameter button"}],"actions":[{"name":"add parameter","parameters":[{"name":"name"}]},{"name":"remove parameter","parameters":[]}],"version":"0.7.0"}*/
module.exports = function () {
    var TractorPageObjectsActionParameter = function TractorPageObjectsActionParameter(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.nameInput = find(by.css('tractor-variable-input[label="Name"] input'));
        this.removeParameterButton = find(by.css('tractor-action[action="Remove parameter"] button'));
    };
    TractorPageObjectsActionParameter.prototype.addParameter = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.nameInput.sendKeys(name);
        });
        return result;
    };
    TractorPageObjectsActionParameter.prototype.removeParameter = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.removeParameterButton.click();
        });
        return result;
    };
    return TractorPageObjectsActionParameter;
}();
```

You'll probably want to use it with [@tractor-plugins/mocha-specs](https://github.com/phenomnomnominal/tractor-plugin-mocha-specs).

## Development

To set up development, just run `yarn` from the root of the repository. You can then run the following commands from within the directory, or use [`lerna run`](https://github.com/lerna/lerna/tree/master/commands/run) with [`--scope="@tractor-plugins/page-objects`](https://www.npmjs.com/package/@lerna/filter-options).

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

If you care, maybe check out the [design decisions document](https://github.com/phenomnomnominal/tractor-plugin-page-objects/tree/master/docs/design%20decisions.md) 😎
