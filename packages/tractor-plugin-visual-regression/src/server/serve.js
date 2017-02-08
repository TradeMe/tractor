// Constants:
import { VISUAL_REGRESSION_DIRECTORY } from './constants';

// Utilities:
import path from 'path';

// Dependencies:
import { FileStructure } from 'tractor-file-structure';
import { createGetDiffsHandler } from './actions/get-diffs';
import { createTakeChangesHandler } from './actions/take-changes';
import { watchFileStructure } from './actions/watch-file-structure';

function serve (application, sockets, config) {
    let fileStructure = new FileStructure(path.join(process.cwd(), config.testDirectory, VISUAL_REGRESSION_DIRECTORY));

    application.get('/visual-regression/get-diffs', createGetDiffsHandler(fileStructure));
    application.put('/visual-regression/take-changes', createTakeChangesHandler(fileStructure));

    watchFileStructure(sockets.of('/watch-visual-regression'), fileStructure);

    return fileStructure.read();
}

export default serve;
