# tractor-error-handler

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-error-handler.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-error-handler.svg)](https://www.npmjs.com/package/tractor-error-handler)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/tractor-error-handler/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-error-handler)
[![bitHound Overall Score](https://www.bithound.io/github/phenomnomnominal/tractor-error-handler/badges/score.svg)](https://www.bithound.io/github/phenomnomnominal/tractor-error-handler)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/tractor-error-handler/badges/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/tractor-error-handler/coverage)

A general HTTP request error handler for [**tractor**](https://github.com/TradeMe/tractor).

## API:

### `TractorError`:

> Creates a new `TractorError`.

> #### Arguments:
> * `message: string` - the error message
> * `status?: number` - the HTTP status of the error

> #### Usage:
> ```javascript
let error = new TractorError('something bad happened', 500);
```

### `TractorError.isTractorError`:

> Checks if something is a `TractorError`.

> #### Arguments:
> * `e: any` - thing to test

> #### Usage:
> ```javascript
TractorError.isTractorError(new TractorError('something bad happened')); // true;
TractorError.isTractorError(new Error('something bad happened')); // false;
```

### `handleError`:

> Sends an error back to the client

> #### Arguments:
> * `response:` [Response](http://expressjs.com/es/api.html#res) - the Express HTTP response object
> * `error: TractorError` - the TractorError that was thrown

> #### Usage:
> ```javascript
import { TractorError, handleError } from 'tractor-error-handler';

export function myApiEndpoint (request, response) {
    if (somethingBad) {
        handleError(response, new TractorError('something bad happened'));
    } else {
        response.sendStatus(200);
    }
}
```
