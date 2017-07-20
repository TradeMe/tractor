# tractor-dependency-injection

Dependency Injection container for [**tractor**](https://github.com/TradeMe/tractor).

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-dependency-injection.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-dependency-injection.svg)](https://www.npmjs.com/package/tractor-dependency-injection)
[![bitHound Overall Score](https://www.bithound.io/github/phenomnomnominal/tractor-dependency-injection/badges/score.svg)](https://www.bithound.io/github/phenomnomnominal/tractor-dependency-injection)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/tractor-dependency-injection/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-dependency-injection)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/tractor-dependency-injection/badges/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-dependency-injection/coverage)

## API:

### `constant`:

> Adds a constant reference to the container by name.

> #### Usage:
> ```javascript
> import { DI } from 'tractor-dependency-injection';
>
> DI.constant({ config: { my: 'config' }});
> ```

### `factory`:

> Adds a factory function to the container by name.

> #### Usage:
> ```javascript
> import { DI } from 'tractor-dependency-injection';
>
> DI.factory(function myFunction () {});
> ```

### `call`:

> calls a function with injected dependencies.

> #### Usage:
> ```javascript
> import { DI } from 'tractor-dependency-injection';
>
> let config = {};
> DI.constant({ config });
>
> function init (config) {}
> init['@Inject'] = ['config'];
>
> DI.call(init);
> ```


### `instantiate`:

> Creates a new instance of a factory with injected dependencies.

> #### Usage:
> ```javascript
> import { DI } from 'tractor-dependency-injection';
>
> let config = {};
> DI.constant({ config });
>
> function Engine () {}
> DI.factory(Engine);
>
> function Tractor (config, engine) {
>     this.config = config;
>     this.engine = engine;
> }
> Tractor['@Inject'] = ['config', 'Engine'];
> DI.factory(Tractor);
>
> let tractor = DI.instantiate(Tractor);
> ```
