// Constants:
import CONSTANTS from './constants';

function handler (response, error, message) {
    console.error(message || error.message);
    response.status(error.status || CONSTANTS.SERVER_ERROR);
    response.send(JSON.stringify({
        error: message || error.message
    }));
}

export default { handler };
