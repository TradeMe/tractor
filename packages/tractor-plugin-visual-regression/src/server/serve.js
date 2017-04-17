// Utilities:
import { getVisualRegressionPath } from './utils';

// Dependencies:
import { FileStructure } from 'tractor-file-structure';
import { createGetDiffsHandler } from './actions/get-diffs';
import { createTakeChangesHandler } from './actions/take-changes';
import { watchFileStructure } from './actions/watch-file-structure';

function serve (application, config, sockets) {
    let fileStructure = new FileStructure(getVisualRegressionPath(config));

    application.get('/visual-regression/get-diffs', createGetDiffsHandler(fileStructure));
    application.put('/visual-regression/take-changes', createTakeChangesHandler(fileStructure));

    watchFileStructure(sockets.of('/watch-visual-regression'), fileStructure);

    return fileStructure.read();
}
serve['@Inject'] = ['application', 'config', 'sockets'];

export default serve;
