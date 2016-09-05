// Dependencies:
import fileStructure from '../file-structure';

// Errors:
import { errorHandler, TractorError } from 'tractor-error-handler';

export default { handler };

function handler (request, response) {
    let { path } = request.query;

    return fileStructure.openFile(path)
    .then((file) => response.send(file))
    .catch(TractorError, error => errorHandler.handler(response, error))
    .catch(() => errorHandler.handler(response, new TractorError(`Could not open "${path}"`)));
}
