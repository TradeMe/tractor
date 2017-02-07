// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, DIFFS_DIRECTORY, VISUAL_REGRESSION_DIRECTORY } from '../constants';

// Utilities:
import Promise from 'bluebird';
import path from 'path';

// Dependencies:
import { DiffPNGFile } from '../files/diff-png-file';
import { PNGFile } from '../files/png-file';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { TractorError } from 'tractor-error-handler';

export function checkDiff (fileStructure, testDirectory, fileName) {
    let baselinePath = path.join(testDirectory, VISUAL_REGRESSION_DIRECTORY, BASELINE_DIRECTORY, fileName);
    let changesPath = path.join(testDirectory, VISUAL_REGRESSION_DIRECTORY, CHANGES_DIRECTORY, fileName);

    let baselinePNGFile = fileStructure.allFilesByPath[baselinePath];
    let changesPNGFile = fileStructure.allFilesByPath[changesPath];

    let baselinePNG = PNG.sync.read(baselinePNGFile.buffer);
    let changesPNG = PNG.sync.read(changesPNGFile.buffer);
    let { width, height } = baselinePNG;
    let diffPNG = new PNG({ width, height });

    if (baselinePNGFile.buffer.equals(changesPNGFile.buffer)) {
        return;
    }

    pixelmatch(baselinePNG.data, changesPNG.data, diffPNG.data, width, height, { threshold: 0.1 });

    let diffsPath = replaceExtension(path.join(testDirectory, VISUAL_REGRESSION_DIRECTORY, DIFFS_DIRECTORY, fileName));

    let diffPNGFile = new DiffPNGFile(diffsPath, fileStructure);
    return diffPNGFile.save(PNG.sync.write(diffPNG))
    .then(() => Promise.reject(new TractorError(`Visual Regression failed for ${fileName}`)));
}

function replaceExtension (filePath) {
    return filePath.replace(PNGFile.prototype.extension, DiffPNGFile.prototype.extension);
}
