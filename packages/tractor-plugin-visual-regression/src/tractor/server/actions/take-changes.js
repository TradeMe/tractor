// Constants:
const OKAY_STATUS = 200;

// Errors:
import { TractorError, handleError } from '@tractor/error-handler';

export function createTakeChangesHandler (fileStructure) {
    let { allFilesByPath } = fileStructure;

    return async function takeChanges (request, response) {
        let { diff } = request.body;
        let baselineFile = allFilesByPath[diff.baseline.path];
        let changesFile = allFilesByPath[diff.changes.path];
        let diffFile = allFilesByPath[diff.diff.path];

        if (baselineFile && changesFile && diffFile) {
            try {
                await baselineFile.delete();
                await changesFile.move({ newPath: baselineFile.path });
                await diffFile.delete();
                response.sendStatus(OKAY_STATUS);
            } catch (error) {
                handleError(response, new TractorError('Could not take changes'));
            }
            return;
        }

        handleError(response, new TractorError('Could not take changes, the files no longer exist.'));
    };
}
