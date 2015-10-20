'use strict';

// Dependencies:
import fileStructure from '../file-structure';
import getFileStructure from './get-file-structure';

// Errors:
import errorHandler from '../errors/error-handler';
import TractorError from '../errors/TractorError';

export default { handler };

function handler (request, response) {
    let { type } = request.params;
    let { data, path } = request.body;

    return fileStructure.saveFile(type, data, path)
    .then(() => getFileStructure.handler(request, response))
    .catch(TractorError, error => errorHandler.handler(response, error))
    .catch(() => errorHandler.handler(response, new TractorError(`Could not save "${path}"`, 500)));
}
