// Dependencies:
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { TractorError } from '@tractor/error-handler';
import { DiffPNGFile } from '../files/diff-png-file';
import { PNGFile } from '../files/png-file';
import { getBaselinePath, getChangesPath, getDiffsPath } from '../utilities';

export async function checkDiff (config, fileStructure, filePath) {
    let baselinePath = getBaselinePath(config, filePath);
    let changesPath = getChangesPath(config, filePath);
    let diffsPath = replaceExtension(getDiffsPath(config, filePath));

    let baselinePNGFile = fileStructure.allFilesByPath[baselinePath];
    let changesPNGFile = fileStructure.allFilesByPath[changesPath];
    let diffPNGFile = fileStructure.allFilesByPath[diffsPath];
    
    let baselinePNG = PNG.sync.read(baselinePNGFile.buffer);
    let changesPNG = PNG.sync.read(changesPNGFile.buffer);
    let { width, height } = baselinePNG;
    let diffPNG = new PNG({ width, height });

    if (baselinePNGFile.buffer.equals(changesPNGFile.buffer)) {
        if (diffPNGFile) {
            await diffPNGFile.delete();
        }
        return;
    }

    let error = new TractorError(`Visual Regression failed for ${filePath}`);
    if (imagesAreSameSize(baselinePNG, changesPNG)) {
        const diffPixelCount = pixelmatch(baselinePNG.data, changesPNG.data, diffPNG.data, width, height, { threshold: 0.1 });
        if (diffPixelCount === 0) {
            return;
        }

    } else {
        error = new TractorError(`New screenshot for ${filePath} is not the same size as baseline.`);    
    }

    diffPNGFile = diffPNGFile || new DiffPNGFile(diffsPath, fileStructure);
    await diffPNGFile.save(PNG.sync.write(diffPNG));
    throw error;
}

function imagesAreSameSize (baselinePNG, changePNG) {
    let sameWidth = baselinePNG.width === changePNG.width;
    let sameHeight = baselinePNG.height === changePNG.height;
    return sameWidth && sameHeight;
}

function replaceExtension (filePath) {
    return filePath.replace(PNGFile.prototype.extension, DiffPNGFile.prototype.extension);
}
