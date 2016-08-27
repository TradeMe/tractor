'use strict';

// Dependencies:
import fileStructure from '../file-structure';
import getFileStructure from './get-file-structure';

// Errors:
import errorHandler from '../errors/error-handler';
import TractorError from '../errors/TractorError';

export default { handler };

function handler (request, response) {
    let { path } = request.body;

    return fileStructure.createDirectory(path)
    .then(() => getFileStructure.handler(request, response))
    .catch(TractorError, error => errorHandler.handler(response, error))
    .catch(() => errorHandler.handler(response, new TractorError('Could not create directory')));
}
