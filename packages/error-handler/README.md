# @tractor/error-handler

A general HTTP request error handler for [**tractor**](https://github.com/TradeMe/tractor).

[![npm version](https://img.shields.io/npm/v/@tractor/error-handler.svg)](https://www.npmjs.com/package/@tractor/error-handler)

## API

### `new TractorError (message: string, status?: number)`

Create a new `TractorError`.

```typescript
const error = new TractorError('something bad happened', 500);
```

### `TractorError.isTractorError (err: TractorError | any): boolean`

Checks if something is a `TractorError`.

```typescript
TractorError.isTractorError(new TractorError('something bad happened')); // true;
TractorError.isTractorError(new Error('something bad happened')); // false;
```

### `handleError (response: Response, err: TractorError, message?: string): void`

Sends an error back to the client, via the [Express HTTP response object](http://expressjs.com/es/api.html#res).

```typescript
import { TractorError, handleError } from '@tractor/error-handler';

export function myApiEndpoint (request: Request, response: Response): void {
    if (somethingBad) {
        handleError(response, new TractorError('something bad happened'));
    } else {
        response.sendStatus(200);
    }
}
```
