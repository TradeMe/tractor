# tractor-config-loader

A configuration loader utility for [**tractor**](https://github.com/TradeMe/tractor).

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-config-loader.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-config-loader.svg)](https://www.npmjs.com/package/tractor-config-loader)
[![Coveralls](https://img.shields.io/coveralls/phenomnomnominal/tractor-config-loader.svg)](https://coveralls.io/github/phenomnomnominal/tractor-config-loader)

## API:

### `loadConfig`:

> Loads a **tractor** configuration file, first from a passed in `--config` flag, then in a *tractor.conf.js* file in the current working directory, before falling back to the default configuration

> #### Returns:
> * `config:` [TractorConfig](https://github.com/TradeMe/tractor#config),

> #### Usage:
> ```javascript
import tractorConfigLoader from 'tractor-config-loader';

> const config = tractorConfigLoader.loadConfig();
```
