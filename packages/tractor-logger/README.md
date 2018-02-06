# @tractor/logger

A general logger for [**tractor**](https://github.com/TradeMe/tractor).

[![npm version](https://img.shields.io/npm/v/@tractor/logger.svg)](https://www.npmjs.com/package/@tractor/logger)

## API:

### `error`:

> Logs errors to the console. Passes through to [`npmlog.error`](https://github.com/npm/npmlog#logloglevel-prefix-message-).

> #### Usage:
> ```javascript
> import { error } from '@tractor/logger';
> error('error'); // 🚜 tractor ERR! error
> ```

### `info`:

> Logs information to the console. Passes through to [`npmlog.info`](https://github.com/npm/npmlog#logloglevel-prefix-message-).

> #### Usage:
> ```javascript
> import { info } from '@tractor/logger';
> info('info'); // 🚜 tractor info info;
> ```

### `warn`:

> Logs information to the console. Passes through to [`npmlog.warn`](https://github.com/npm/npmlog#logloglevel-prefix-message-).

> #### Usage:
> ```javascript
> import { warn } from '@tractor/logger';
> warn('warn'); // 🚜 tractor WARN warn;
> ```
