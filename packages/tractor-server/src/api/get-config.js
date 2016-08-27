'use strict';

// Constants:
import { config } from '../config';

export default { handler };

function handler (request, response) {
    response.send(config);
}
