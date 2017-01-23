# tractor-config-loader

[![npm version](https://img.shields.io/npm/v/tractor-config-loader.svg)](https://img.shields.io/npm/v/tractor-config-loader.svg)

A configuration loader utility for [**tractor**](https://github.com/TradeMe/tractor).

## API:

### `loadConfig`:

> Loads a **tractor** configuration file, first from a passed in `--config` flag, then in a *tractor.conf.js* file in the current working directory, before falling back to the default configuration

> #### Returns:
> * `config: `[TractorConfig](https://github.com/TradeMe/tractor#config),

> #### Usage:
> ```javascript
import tractorConfigLoader from 'tractor-config-loader';

> const config = tractorConfigLoader.loadConfig();
```
