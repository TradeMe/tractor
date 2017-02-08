# tractor-error-handler

[![Greenkeeper badge](https://badges.greenkeeper.io/phenomnomnominal/tractor-error-handler.svg)](https://greenkeeper.io/)
[![npm version](https://img.shields.io/npm/v/tractor-error-handler.svg)](https://www.npmjs.com/package/tractor-error-handler)
[![Coveralls](https://img.shields.io/coveralls/phenomnomnominal/tractor-error-handler.svg)](https://coveralls.io/github/phenomnomnominal/tractor-error-handler)

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

### `tractorErrorHandler.handle`:

> Sends an error back to the client

> #### Arguments:
> * `response:` [Response](http://expressjs.com/es/api.html#res) - the Express HTTP response object
> * `error: TractorError` - the TractorError that was thrown

> #### Usage:
> ```javascript
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';
export default function myApiEndpoint (request, response) {
    if (somethingBad) {
        tractorErrorHandler.handle(response, new TractorError('something bad happened'));
    } else {
        response.sendStatus(200);
    }
}
```
