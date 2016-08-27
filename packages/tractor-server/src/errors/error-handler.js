'use strict';

// Constants:
import constants from '../constants';

// Utilities:
import log from 'npmlog';

export default { handler };

function handler (response, error, message) {
    log.error(message || error.message);
    response.status(error.status || constants.SERVER_ERROR);
    response.send(JSON.stringify({
        error: message || error.message
    }));
}
