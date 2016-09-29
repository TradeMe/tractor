# tractor-config-loader - v0.1.0

A little script to load a configuration for [**tractor**](https://github.com/TradeMe/tractor).

## How it works:

It looks for a **tractor** configuration (described [here](https://github.com/TradeMe/tractor#config)), first from a passed in `--config` flag, then in a *tractor.conf.js* file in the current working directory, before falling back to the default configuration.

## Usage:

```
import tractorConfigLoader from 'tractor-config-loader';

const config = tractorConfigLoader.loadConfig();
```
