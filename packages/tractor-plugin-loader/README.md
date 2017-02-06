# tractor-plugin-loader

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-plugin-loader.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-plugin-loader.svg)](https://img.shields.io/npm/v/tractor-plugin-loader.svg)

Plugin loader for [**tractor**](https://github.com/TradeMe/tractor) to provide additional UI testing capabilities.

## How it works:

**tractor-plugin-loader** is automatically installed whenever you run `tractor init` in a project. Then, whenever `tractor start` is run on that project, the loader looks through your installed node modules, and finds any that are called **tractor-plugin-whatever**. Those plugins could provide new actions for Page Objects, new report generators, or entirely new bits of UI/Functionality for the [**tractor-client**](https://github.com/phenomnomnominal/tractor-client) application, all depending on what the plugin exports.

## Plugin API:

A **tractor** plugin is just a plain old node module, with a few specially named exports, and maybe some bundled UI code. If you want to see an example of a basic plugin, check out [**tractor-plugin-browser**](https://github.com/phenomnomnominal/tractor-plugin-browser).

### `create` (required):

> Defines how an instance of the plugin will be instantiated when Protractor runs. It should return a concrete implementation of each of the [`description`](https://github.com/phenomnomnominal/tractor-plugin-loader#description-required).

> #### Arguments:
> * `browser: `[`Browser`](http://www.protractortest.org/#/api?view=ProtractorBrowser)
> * `config: `[`TractorConfig`](https://github.com/TradeMe/tractor#config)

> #### Returns:
> * `plugin: any`

### `description` (required):

> The `description` of any actions that the plugin provides to **tractor**. It should be an object with a single property, `methods: Array`[`<Method>`](https://github.com/phenomnomnominal/tractor-plugin-loader#method).

## `addHooks` (optional):

> Add any Cucumber hooks that the plugin needs, e.g. Before, After.

> #### Arguments:
> * `cucumber: `[`Cucumber`](https://cucumber.io/docs/reference#hooks)

### `init` (optional):

> Initialise anything that your plugin needs before it runs. This may be things like creating directories or getting information about the current environment, before **tractor** starts running.

> #### Arguments:
> * `config: `[`TractorConfig`](https://github.com/TradeMe/tractor#config)

> #### Returns:
> * `promise?: Promise`

### `serve` (optional):

> Define any new endpoints that you want to attach to the [**tractor-server**](https://github.com/phenomnomnominal/tractor-server), typically for consuming from the [**tractor-client**](https://github.com/phenomnomnominal/tractor-client).

> #### Arguments:
* `application: `[`Application`](https://expressjs.com/en/4x/api.html#app)
* `config: `[`TractorConfig`](https://github.com/TradeMe/tractor#config)

### UI Script (optional):

> A plugin can also contain UI code. The loader looks for a file at *node_modules/tractor-plugin-my-plugin/dist/client/bundle.js* and injects that into the **tractor-client** when it is served. It is run before the bootstrapping of the Angular application, so it can set-up routes etc. To see an example of how this works, check out [**tractor-plugin-visual-regression**](https://github.com/phenomnomnominal/tractor-plugin-visual-regression).

## Interfaces:

### `Method`:

```javascript
interface Method {
    name: string;
    description: string;
    arguments: Array<Argument>;
    returns?: 'promise' | 'boolean' | 'number' | 'string';
}
```

### `Argument`:

```javascript
interface Argument {
    name: string;
    description: string;
    type: 'boolean' | 'number' | 'string';
    required?: boolean;
}
```
