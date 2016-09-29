# tractor-plugin-loader - v0.1.0

A plugin loader for [**tractor**](https://github.com/TradeMe/tractor) to provide additional UI testing capabilities.

## How it works:

**tractor-plugin-loader** is automatically installed whenever you run `tractor init` in a project (which requires having `tractor` installed globally). Then, whenever `tractor start` is run on that project, the loader looks through your installed *node_modules*, and finds any that are called **tractor-plugin-***. Those plugins could provide new actions for Page Objects, new report generators, or entirely new bits of UI/Functionality for the [**tractor-client**](https://github.com/phenomnomnominal/tractor-client) application, all depending on what the plugin exports.

## Plugin API:

A **tractor** plugin is just be a plain old Node module, with a few specially names exports, and maybe some bundled UI code. If you want to see an example of a basic plugin, check out [**tractor-plugin-browser**](https://github.com/phenomnomnominal/tractor-plugin-browser).

### **description** (required):

The `description` object of the bundle describes any actions that the plugin provides to **tractor**. It should be exported with a property `methods`, which should be an array of `Method`s:

    interface Method {
        name: string;
        description: string;
        arguments: Argument[];
        returns?: 'promise' | 'boolean' | 'number' | 'string';
    }

Where an `Argument` looks like:

    interface Argument {
        name: string;
        description: string;
        type: 'boolean' | 'number' | 'string';
        required?: boolean;
    }

### **create** (required):

The `create` function defines how an instance of the plugin will be instantiated when Protractor runs. It should return a concrete implementation of each of the `Method`s in the description. It should have the following function signature:

    create (browser: Browser, config: TractorConfig) => Plugin

* [`Browser`](http://www.protractortest.org/#/api?view=ProtractorBrowser)
* [`TractorConfig`](https://github.com/TradeMe/tractor#config)

### **init** (optional):

The `init` function is where you set up anything that your plugin needs before it runs. This may be things like creating directories or getting information about the current environment, before **tractor** starts running. It should have the following function signature:

     init (config: TractorConfig) => void

* [`TractorConfig`](https://github.com/TradeMe/tractor#config)     

### **serve** (optional):

The `serve` function is where you define any new endpoints that you may want to attach to the [**tractor-server**](https://github.com/phenomnomnominal/tractor-server), typically for consuming from the [**tractor-client**](https://github.com/phenomnomnominal/tractor-client). It should have the following function signature:

    server (express: Express, application: Application, config: TractorConfig) => void

* [`Express`](https://expressjs.com/en/4x/api.html#express)
* [`Application`](https://expressjs.com/en/4x/api.html#app)
* [`TractorConfig`](https://github.com/TradeMe/tractor#config)

### **script** (optional):

A plugin can also contain UI code. The loader looks for a file at *node_modules/tractor-plugin-\*/dist/client/bundle.js* and injects that into the **tractor-client** when it is served. It is run before the bootstrapping of the Angular application, so it can set-up routes etc. To see an example of how this works, check out [**tractor-plugin-visual-regression**](https://github.com/phenomnomnominal/tractor-plugin-visual-regression).
