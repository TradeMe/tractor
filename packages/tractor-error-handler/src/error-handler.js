// Constants:
import CONSTANTS from './constants';

// Dependencies:
import { error } from 'tractor-logger';

export function handle (response, err, message) {
    error(message || err.message);
    response.status(err.status || CONSTANTS.SERVER_ERROR);
    response.send(JSON.stringify({
        error: message || err.message
    }));
}
