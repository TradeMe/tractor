// Constants:
import CONSTANTS from '../constants';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
import pixelmatch from 'pixelmatch';
import PNGFile from '../files/PNGFile';
import pngjs from 'pngjs';
import Results from '../Results';
import tractorFileStructure from 'tractor-file-structure';

export default class DiffReporter {
    generateReport (renderer) {
        let fileStructure = tractorFileStructure.fileStructure;
        let visualRegressionDirectory = fileStructure.structure.getDirectory(CONSTANTS.VISUAL_REGRESSION_DIRECTORY);
        let baselineDirectory = visualRegressionDirectory.getDirectory(CONSTANTS.BASELINE_DIRECTORY);
        let diffsDirectory = visualRegressionDirectory.getDirectory(CONSTANTS.DIFFS_DIRECTORY);
        let baselinePNGFiles = baselineDirectory.getFiles(PNGFile);

        let prepare = diffsDirectory ? diffsDirectory.rimraf() : Promise.resolve();

        renderer.before();

        return prepare.then(() => {
            return Promise.map(baselinePNGFiles, baselinePNGFile => {
                let changesPath = baselinePNGFile.path.replace(CONSTANTS.BASELINE_DIRECTORY, CONSTANTS.CHANGES_DIRECTORY);
                let changesPNGFile = fileStructure.allFilesByPath[changesPath];

                if (!changesPNGFile) {
                    let result = {
                        baseline: baselinePNGFile.url,
                        result: Results.IMAGE_NEW
                    };
                    renderer.result(result);
                    return result;
                }

                if (baselinePNGFile.buffer.equals(changesPNGFile.buffer)) {
                    let result = {
                        baseline: baselinePNGFile.url,
                        result: Results.IMAGE_SIMILAR
                    };
                    renderer.result(result);
                    return changesPNGFile.cleanup()
                    .then(() => result);
                }

                let baselinePNG = pngjs.PNG.sync.read(baselinePNGFile.buffer);
                let changesPNG = pngjs.PNG.sync.read(changesPNGFile.buffer);
                let { width, height } = baselinePNG;
                let diffPNG = new pngjs.PNG({ width, height });
                pixelmatch(baselinePNG.data, changesPNG.data, diffPNG.data, width, height, { threshold: 0.1 });

                let diffPath = baselinePNGFile.path.replace(CONSTANTS.BASELINE_DIRECTORY, CONSTANTS.DIFFS_DIRECTORY);

                let diffPNGFile = new PNGFile(diffPath, fileStructure);
                return diffPNGFile.save(pngjs.PNG.sync.write(diffPNG))
                .then(() => {
                    let result = {
                        baseline: baselinePNGFile.url,
                        changes: changesPNGFile.url,
                        diff: diffPNGFile.url,
                        result: Results.IMAGE_DIFFERENT
                    };
                    renderer.result(result);
                    return result;
                });
            });
        })
        .then(results => {
            renderer.after(results);
            return results;
        });
    }
}
