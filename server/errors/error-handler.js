'use strict';

// Utilities:
import log from 'npmlog';

export default { handler };

function handler (response, error, message) {
    log.error(message || error.message);
    response.status(error.status || 500);
    response.send(JSON.stringify({
        error: message || error.message
    }));
}
