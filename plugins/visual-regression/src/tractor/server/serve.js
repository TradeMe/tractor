// Dependencies:
import { FileStructure, serveFileStructure } from '@tractor/file-structure';
import { createGetDiffsHandler } from './actions/get-diffs';
import { createTakeChangesHandler } from './actions/take-changes';
import { getVisualRegressionPath } from './utilities';
import { DiffPNGFile } from './files/diff-png-file';
import { PNGFile } from './files/png-file';

export function serve (application, config, di) {
    const visualRegressionFileStructure = new FileStructure(getVisualRegressionPath(config), 'visual-regression');
    visualRegressionFileStructure.addFileType(DiffPNGFile);
    visualRegressionFileStructure.addFileType(PNGFile);

    application.get('/visual-regression/get-diffs', createGetDiffsHandler(visualRegressionFileStructure));
    application.put('/visual-regression/take-changes', createTakeChangesHandler(visualRegressionFileStructure));

    di.constant({ visualRegressionFileStructure });
    di.call(serveFileStructure)(visualRegressionFileStructure);
}
serve['@Inject'] = ['application', 'config', 'di', 'sockets'];
