# @tractor/config-loader

A configuration loader utility for [**tractor**](https://github.com/TradeMe/tractor).

[![npm version](https://img.shields.io/npm/v/@tractor/config-loader.svg)](https://www.npmjs.com/package/@tractor/config-loader)

## API

### `loadConfig (cwd: string, configPath?: string): TractorConfig`

Load a [**tractor** configuration file](https://github.com/TradeMe/tractor#config) from a given directory and path (defaults to *./tractor.conf.js*), before falling back to the default configuration.

```typescript
import { loadConfig } from '@tractor/config-loader';

const config = loadConfig(process.cwd(), './path/to/tractor.conf.js');
```

### `getConfig (): TractorConfig`

Retrieves the current config for the running Tractor instance. `loadConfig()` must be called befere calling `getConfig()`.

```typescript
import { getConfig } from '@tractor/config-loader';

const config = getConfig();
```
