// Constants:
import config from '../config/config';
import constants from '../constants';

// Utilities:
import { join } from 'path';

export default { handler };

function handler (request, response) {
    let { type } = request.params;
    let extension = constants.EXTENSIONS[type];

    let { path, name } = request.query;
    let fileName = name + extension;
    path = path || join(process.cwd(), config.testDirectory, type, fileName);

    response.send({ path });
}
