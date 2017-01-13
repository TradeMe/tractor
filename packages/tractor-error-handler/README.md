# tractor-error-handler
[![npm version](https://badge.fury.io/js/tractor-error-handler.svg)](https://badge.fury.io/js/tractor-error-handler)

A general HTTP request error handler for [**tractor**](https://github.com/TradeMe/tractor).

## Usage:

```javascript
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
