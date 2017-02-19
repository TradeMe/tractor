// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, VISUAL_REGRESSION_DIRECTORY } from '../constants';
const GET_PIXEL_RATIO = 'return window.devicePixelRatio';

// Utilities:
import Promise from 'bluebird';
import path from 'path';

// Dependencies:
import { checkDiff } from '../differ/check-diff';
import { createIgnoredArea, createIncludedArea, updateAreas } from '../image-areas/image-areas';
import { PNGFile } from '../files/png-file';
import { FileStructure } from 'tractor-file-structure';

export class VisualRegression {
    constructor (
        browser,
        config
    ) {
        this.browser = browser;
        this.config = config;
        this.areas = [];
    }

    ignoreArea (...coordinates) {
        this.areas.push(createIgnoredArea(...coordinates));
    }

    includeArea (...coordinates) {
        this.areas.push(createIncludedArea(...coordinates));
    }

    takeScreenshot (name) {
        let fileName = createFileName(name);

        let testDirectory = path.join(process.cwd(), this.config.testDirectory);
        let visualRegressionPath = path.join(testDirectory, VISUAL_REGRESSION_DIRECTORY);
        let baselineFilePath = path.join(visualRegressionPath, BASELINE_DIRECTORY, fileName);
        let changesFilePath = path.join(visualRegressionPath, CHANGES_DIRECTORY, fileName);

        let fileStructure;
        let hasBaseline;
        let pixelRatio;
        let savePath;

        return createFileStructure(visualRegressionPath)
        .then(_fileStructure => {
            fileStructure = _fileStructure;
        })
        .then(() => checkForBaseline(fileStructure, testDirectory, fileName))
        .then(_hasBaseline => {
            hasBaseline = _hasBaseline;
            savePath = hasBaseline ? changesFilePath : baselineFilePath;
        })
        .then(() => this.browser.sleep(1000))
        .then(() => this.browser.executeScript(GET_PIXEL_RATIO))
        .then(_pixelRatio => {
            pixelRatio = _pixelRatio;
            return this.browser.takeScreenshot();
        })
        .then(rawPngData => saveScreenshot(fileStructure, savePath, updateAreas(rawPngData, this.areas, pixelRatio)))
        .then(() => {
            if (hasBaseline) {
                return checkDiff(fileStructure, testDirectory, fileName);
            }
        })
        .then(() => {
            this.areas = [];
            return null;
        })
        .catch(error => error.message);
    }
}

let fileStructure;
function createFileStructure (path) {
    if (fileStructure) {
        return Promise.resolve(fileStructure);
    }
    fileStructure = new FileStructure(path);
    return fileStructure.read()
    .then(() => fileStructure)
}

function createFileName (name) {
    return `${name}${PNGFile.prototype.extension}`;
}

function checkForBaseline (fileStructure, testDirectory, fileName) {
    let filePath = path.join(testDirectory, VISUAL_REGRESSION_DIRECTORY, BASELINE_DIRECTORY, fileName);
    return !!fileStructure.allFilesByPath[filePath];
}

function saveScreenshot (fileStructure, savePath, png) {
    let pngFile = new PNGFile(savePath, fileStructure);
    return pngFile.save(png);
}
