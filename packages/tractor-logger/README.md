# tractor-logger

A general logger for [**tractor**](https://github.com/TradeMe/tractor).

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-logger.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-logger.svg)](https://www.npmjs.com/package/tractor-logger)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/tractor-logger/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-logger)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/tractor-logger/badges/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-logger/coverage)

## API:

### `error`:

> Logs errors to the console. Passes through to [`npmlog.error`](https://github.com/npm/npmlog#logloglevel-prefix-message-).

> #### Usage:
> ```javascript
> import { error } from 'tractor-logger';
> error('error'); // 🚜 tractor ERR! error
> ```

### `info`:

> Logs information to the console. Passes through to [`npmlog.info`](https://github.com/npm/npmlog#logloglevel-prefix-message-).

> #### Usage:
> ```javascript
> import { info } from 'tractor-logger';
> info('info'); // 🚜 tractor info info;
> ```

### `warn`:

> Logs information to the console. Passes through to [`npmlog.warn`](https://github.com/npm/npmlog#logloglevel-prefix-message-).

> #### Usage:
> ```javascript
> import { warn } from 'tractor-logger';
> warn('warn'); // 🚜 tractor WARN warn;
> ```
