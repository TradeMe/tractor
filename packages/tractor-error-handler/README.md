# tractor-error-handler - v0.1.0

A general error handler for [**tractor**](https://github.com/TradeMe/tractor).

## Usage:

    import tractorErrorHandler from 'tractor-error-handler';
    import { TractorError } from 'tractor-error-handler';

    export default function myApiEndpoint (request, response) {
        if (somethingBad) {
            tractorErrorHandler.handle(response, new TractorError('something bad happened'));
        } else {
            response.sendStatus(200);
        }
    }
