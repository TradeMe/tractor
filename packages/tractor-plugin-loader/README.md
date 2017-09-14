# tractor-plugin-loader

Plugin loader for [**tractor**](https://github.com/TradeMe/tractor) to provide additional UI testing capabilities.

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-plugin-loader.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-plugin-loader.svg)](https://www.npmjs.com/package/tractor-plugin-loader)
[![bitHound Overall Score](https://www.bithound.io/github/phenomnomnominal/tractor-plugin-loader/badges/score.svg)](https://www.bithound.io/github/phenomnomnominal/tractor-plugin-loader)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/tractor-plugin-loader/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-plugin-loader)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/tractor-plugin-loader/badges/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-plugin-loader/coverage)

## How it works:

**tractor-plugin-loader** is automatically installed whenever you run `tractor init` in a project. Then, whenever `tractor start` is run on that project, the loader looks through your installed node modules, and finds any that are called **tractor-plugin-whatever**. Those plugins could provide new actions for Page Objects, new report generators, or entirely new bits of UI/Functionality for the [**tractor-client**](https://github.com/phenomnomnominal/tractor-client) application, all depending on what the plugin exports.

## API:

A **tractor** plugin is just a plain old node module, with a few specially named exports, and maybe some bundled UI code. If you want to see an example of a basic plugin, check out [**tractor-plugin-browser**](https://github.com/phenomnomnominal/tractor-plugin-browser).

### `description` (optional)

> The `description` of any actions that the plugin provides to **tractor**. It should be an object with a single property, `methods: Array`[`<Method>`](https://github.com/phenomnomnominal/tractor-plugin-loader#method).

### `create` (optional):

> Defines how an instance of the plugin will be instantiated when Protractor runs. It should return a concrete implementation of each of the [`description`](https://github.com/phenomnomnominal/tractor-plugin-loader#description-optional).

> #### Returns:
> * `plugin: any`

### `init` (optional):

> Initialise anything that your plugin needs before it runs. This may be things like creating directories or getting information about the current environment, before **tractor** starts running.

> #### Returns:
> * `promise?: Promise`

### `run` (optional):

> Run any extra code you need before the app server starts. At the point that this is called all other plugins have been initialised and served.

> #### Returns:
> * `promise?: Promise`

### `serve` (optional):

> Define any new endpoints that you want to attach to the [**tractor-server**](https://github.com/phenomnomnominal/tractor-server), typically for consuming from the [**tractor-client**](https://github.com/phenomnomnominal/tractor-client).

> #### Returns:
> * `promise?: Promise`

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
