// Constants:
import { SERVER_ERROR } from './constants';

// Dependencies:
import { error } from 'tractor-logger';

export function handleError (response, err, message) {
    error(message || err.message);
    response.status(err.status || SERVER_ERROR);
    response.send(JSON.stringify({
        error: message || err.message
    }));
}
