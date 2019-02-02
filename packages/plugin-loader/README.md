# @tractor/plugin-loader

Plugin loader for [**tractor**](https://github.com/TradeMe/tractor) to provide additional UI testing capabilities.

[![npm version](https://img.shields.io/npm/v/@tractor/plugin-loader.svg)](https://www.npmjs.com/package/@tractor/plugin-loader)

## API

### `loadPlugins (config: TractorPluginConfig): Array<TractorPlugin>`

Loads all available [**tractor** plugins](https://github.com/TradeMe/tractor/tree/master/packages/plugin-loader#plugin) for a project.

```typescript
import { loadConfig } from '@tractor/config-loader';
import { loadPlugins } from '@tractor/plugin-loader';

const config = loadConfig(process.cwd(), './path/to/tractor.conf.js');
const plugins = loadPlugins(config);
```

### `getPlugins (): Array<TractorPlugin`

Retrieves the current plugins for the running Tractor instance. `loadPlugins()` must be called befere calling `getPlugins()`.

```typescript
import { getPlugins } from '@tractor/plugin-loader';

const plugins = getPlugins();
```

## How it works

Whenever `tractor` is run, the loader looks through your installed node modules, and finds any that are called **@tractor-plugin/whatever**. Those plugins could provide new actions for tests, new testing styles, or entirely new bits of UI/Functionality for the [**@tractor/ui**](https://github.com/TradeMe/tractor/tree/master/packages/ui) application, all depending on what the plugin exports.

## Plugin

A **tractor** plugin is just a plain old node module, with a few specially named exports, and maybe some bundled UI code. If you want to see an example of a basic plugin, check out [**tractor-plugin-browser**](https://github.com/TradeMe/tractor/tree/master/plugins/browser). A plugin looks something like this:

```typescript
import { Config } from 'protractor';

export type TractorPlugin<T> = {
    description: {
        actions: Array<TractorAction>
    };

    create (): T;
    init (): Promise<void> | void;
    plugin (protractorConfig: Config): Config;
    run (): Promise<void> | void;
    serve (): Promise<void> | void;
    upgrade (): Promise<void> | void;
};
```

### `description` (optional)

The `description` of the plugin object. Check out the type signature in more details [here](https://github.com/TradeMe/tractor/tree/master/packages/plugin-loader/src/tractor-plugin.ts).

### `create` (optional)

Defines how an instance of the plugin will be instantiated when Protractor runs. It should return a concrete implementation of each of the [`description`](https://github.com/TradeMe/tractor/tree/master/packages/tractor-plugin-loader#description-optional).

### `init` (optional)

Initialise anything that the plugin needs before it runs. This may be things like creating directories or getting information about the current environment, before **tractor** starts running.

### `plugin` (optional)

Modify the `portractorConfig` before [Protractor](http://angular.github.io/protractor/) runs. This is where the plugin should set up any Protractor plugins that it needs. To see an example of how this works, check out [**@tractor-plugin/mocha-specs**](https://github.com/TradeMe/tractor/tree/master/plugins/mocha-specs).

### `run` (optional)

Run any extra code the need before the app server starts. At the point that this is called all other plugins have been initialised and served.

### `serve` (optional)

Define any new endpoints that the plugin needs to attach to the [**@tractor/server**](https://github.com/TradeMe/tractor/tree/master/packages/tractor-server), typically for consuming from the [**@tractor/ui**](https://github.com/TradeMe/tractor/tree/master/packages/ui).

### UI Script (optional)

A plugin can also contain UI code. The loader looks for a file at *@tractor-plugin/my-plugin/dist/client/bundle.js* and injects that into the **@tractor/ui** when it is served. It is run before the bootstrapping of the Angular application, so it can set-up routes etc. To see an example of how this works, check out [**@tractor-plugin/visual-regression**](https://github.com/TradeMe/tractor/tree/master/plugins/visual-regression).
