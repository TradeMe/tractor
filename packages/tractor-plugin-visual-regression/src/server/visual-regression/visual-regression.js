// Constants:
const GET_PIXEL_RATIO = 'return window.devicePixelRatio';

// Utilities:
import Promise from 'bluebird';
import path from 'path';
import { getBaselinePath, getChangesPath, getVisualRegressionPath } from '../utils';

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

    takeScreenshot (filePath) {
        let visualRegressionPath = getVisualRegressionPath(this.config);
        let baselineFilePath;
        let changesFilePath;
        let fileStructure;
        let hasBaseline;
        let pixelRatio;
        let savePath;

        return getBrowserSize(this.browser)
        .then(size => {
            let { height, width } = size;
            filePath = createFilePath(`${filePath} @ ${width}x${height}`);
        })
        .then(() => getBrowserCapabilities(this.browser))
        .then(capabilities => {
            let platform = capabilities.get('platform');
            let browser = capabilities.get('browserName');
            baselineFilePath = getBaselinePath(this.config, path.join(platform, browser, filePath));
            changesFilePath =  getChangesPath(this.config, path.join(platform, browser, filePath));
        })
        .then(() => createFileStructure(visualRegressionPath))
        .then(_fileStructure => {
            fileStructure = _fileStructure;
        })
        .then(() => checkForBaseline(baselineFilePath))
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
                return checkDiff(this.config, fileStructure, filePath);
            }
        })
        .then(() => {
            this.areas = [];
            return null;
        })
        .catch(error => error.message);
    }
}

function getBrowserCapabilities (browser) {
    return browser.getCapabilities();
}

function getBrowserSize (browser) {
    return browser.driver.manage().window().getSize();
}

let fileStructure;
function createFileStructure (visualRegressionPath) {
    if (fileStructure) {
        return Promise.resolve(fileStructure);
    }
    fileStructure = new FileStructure(visualRegressionPath);
    return fileStructure.read()
    .then(() => fileStructure);
}

function createFilePath (filePath) {
    return `${filePath}${PNGFile.prototype.extension}`;
}

function checkForBaseline (baselineFilePath) {
    return !!fileStructure.allFilesByPath[baselineFilePath];
}

function saveScreenshot (fileStructure, savePath, png) {
    let pngFile = new PNGFile(savePath, fileStructure);
    return pngFile.save(png);
}
