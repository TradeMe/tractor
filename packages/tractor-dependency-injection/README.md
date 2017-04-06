# tractor-dependency-injection

Dependency Injection container for [**tractor**](https://github.com/TradeMe/tractor).

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-dependency-injection.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-dependency-injection.svg)](https://www.npmjs.com/package/tractor-dependency-injection)
[![Coveralls](https://img.shields.io/coveralls/phenomnomnominal/tractor-dependency-injection.svg)](https://coveralls.io/github/phenomnomnominal/tractor-dependency-injection)

## API:

### `constant`:

> Adds a constant reference to the container by name.

> #### Usage:
> ```javascript
> import { constant } from 'tractor-dependency-injection';
>
> constant({ config: { my: 'config' }});
> ```

## API:

### `factory`:

> Adds a factory function to the container by name.

> #### Usage:
> ```javascript
> import { factory } from 'tractor-dependency-injection';
>
> factory(function myFunction () {});
> ```

## API:

### `instantiate`:

> Adds a factory function to the container by name.

> #### Usage:
> ```javascript
> import { factory } from 'tractor-dependency-injection';
>
> let config = {};
> constant({ config });
>
> function Engine () {}
> factory(Engine);
>
> function Tractor (config, engine) {
>     this.config = config;
>     this.engine = engine;
> }
> Tractor['@Inject'] = ['config', 'Engine'];
> factory(Tractor);
>
> let tractor = instantiate(Tractor);
> ```
