// Dependencies:
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { TractorError } from '@tractor/error-handler';
import { DiffPNGFile } from '../files/diff-png-file';
import { PNGFile } from '../files/png-file';
import { getBaselinePath, getChangesPath, getDiffsPath } from '../utilities';

export async function checkDiff (config, fileStructure, filePath) {
    const baselinePath = getBaselinePath(config, filePath);
    const changesPath = getChangesPath(config, filePath);
    const diffsPath = replaceExtension(getDiffsPath(config, filePath));

    const baselinePNGFile = fileStructure.allFilesByPath[baselinePath];
    const changesPNGFile = fileStructure.allFilesByPath[changesPath];
    const diffPNGFile = fileStructure.allFilesByPath[diffsPath];

    if (diffPNGFile){
        await diffPNGFile.delete();
    }
    
    const baselinePNG = PNG.sync.read(baselinePNGFile.buffer);
    const changesPNG = PNG.sync.read(changesPNGFile.buffer);
    const { width, height } = baselinePNG;
    const diffPNG = new PNG({ width, height });

    if (baselinePNGFile.buffer.equals(changesPNGFile.buffer)) {
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

    const newDiffPNGFile = new DiffPNGFile(diffsPath, fileStructure);
    await newDiffPNGFile.save(PNG.sync.write(diffPNG));
    throw error;
}

function imagesAreSameSize (baselinePNG, changePNG) {
    const sameWidth = baselinePNG.width === changePNG.width;
    const sameHeight = baselinePNG.height === changePNG.height;
    return sameWidth && sameHeight;
}

function replaceExtension (filePath) {
    return filePath.replace(PNGFile.prototype.extension, DiffPNGFile.prototype.extension);
}
