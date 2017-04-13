# tractor-config-loader

A configuration loader utility for [**tractor**](https://github.com/TradeMe/tractor).

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-config-loader.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-config-loader.svg)](https://www.npmjs.com/package/tractor-config-loader)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/tractor-config-loader/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-config-loader)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/tractor-config-loader/badges/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-config-loader/coverage)

## API:

### `getConfig`:

> Loads a **tractor** configuration file, first from a passed in `--config` flag, then in a *tractor.conf.js* file in the current working directory, before falling back to the default configuration

> #### Returns:
> * `config:` [TractorConfig](https://github.com/TradeMe/tractor#config),

> #### Usage:
> ```javascript
import { getConfig } from 'tractor-config-loader';

> const config = getConfig();
```
