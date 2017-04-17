// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, DIFFS_DIRECTORY } from '../constants';

// Utilities:
import Promise from 'bluebird';
import path from 'path';

// Dependencies:
import { DiffPNGFile } from '../files/diff-png-file';
import { PNGFile } from '../files/png-file';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { TractorError } from 'tractor-error-handler';

export function checkDiff (fileStructure, visualRegressionPath, fileName) {
    let baselinePath = path.join(visualRegressionPath, BASELINE_DIRECTORY, fileName);
    let changesPath = path.join(visualRegressionPath, CHANGES_DIRECTORY, fileName);

    let baselinePNGFile = fileStructure.allFilesByPath[baselinePath];
    let changesPNGFile = fileStructure.allFilesByPath[changesPath];

    let baselinePNG = PNG.sync.read(baselinePNGFile.buffer);
    let changesPNG = PNG.sync.read(changesPNGFile.buffer);
    let { width, height } = baselinePNG;
    let diffPNG = new PNG({ width, height });

    if (baselinePNGFile.buffer.equals(changesPNGFile.buffer)) {
        return;
    }

    let error;
    if (!imagesAreSameSize(baselinePNG, changesPNG)) {
        error = new TractorError(`New screenshot for ${fileName} is not the same size as baseline.`);
    }

    pixelmatch(baselinePNG.data, changesPNG.data, diffPNG.data, width, height, { threshold: 0.1 });

    let diffsPath = replaceExtension(path.join(visualRegressionPath, DIFFS_DIRECTORY, fileName));

    let diffPNGFile = new DiffPNGFile(diffsPath, fileStructure);
    return diffPNGFile.save(PNG.sync.write(diffPNG))
    .then(() => Promise.reject(error || new TractorError(`Visual Regression failed for ${fileName}`)));
}

function imagesAreSameSize (baselinePNG, changePNG) {
    let sameWidth = baselinePNG.width === changePNG.width;
    let sameHeight = baselinePNG.height === changePNG.height;
    return sameWidth && sameHeight;
}

function replaceExtension (filePath) {
    return filePath.replace(PNGFile.prototype.extension, DiffPNGFile.prototype.extension);
}
