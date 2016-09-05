// Dependencies:
import fileStructure from '../file-structure';
import getFileStructure from './get-file-structure';

// Errors:
import { errorHandler, TractorError } from 'tractor-error-handler';

export default { handler };

function handler (request, response) {
    let { type } = request.params;
    let { data, path } = request.body;

    return fileStructure.saveFile(type, data, path)
    .then(() => getFileStructure.handler(request, response))
    .catch(TractorError, error => errorHandler.handler(response, error))
    .catch(() => errorHandler.handler(response, new TractorError(`Could not save "${path}"`)));
}
