// Dependencies:
import path from 'path';
import { FileStructure } from '@tractor/file-structure';
import { checkDiff } from '../differ/check-diff';
import { createIgnoredArea, createIncludedArea, updateAreas } from '../image-areas/image-areas';
import { DiffPNGFile } from '../files/diff-png-file';
import { PNGFile } from '../files/png-file';
import { getBaselinePath, getChangesPath, getVisualRegressionPath } from '../utilities';

// Constants:
const GET_PIXEL_RATIO = 'return window.devicePixelRatio';
const SCROLL_TO_TOP = 'return document.body.scrollIntoView()';
let fileStructure;

export class VisualRegression {
    constructor (
        browser,
        config
    ) {
        this.browser = browser;
        this.config = config;
        this.areas = [];
    }

    async ignoreElement (element) {
        let { left, top, right, bottom } = await this._getElementSize(element);
        this.areas.push(createIgnoredArea(left, top, right, bottom));
    }

    async includeElement (element) {
        let { left, top, right, bottom } = await this._getElementSize(element);
        this.areas.push(createIncludedArea(left, top, right, bottom));
    }

    async takeScreenshot (name, description) {
        let pixelRatio = await this.browser.executeScript(GET_PIXEL_RATIO);
        let capabilities = await this.browser.getCapabilities();
        let platform = capabilities.get('platform');
        let browser = capabilities.get('browserName');

        let imageName = `${platform} - ${browser} @ ${pixelRatio}x`;

        let filePath = this._createFilePath(path.join(name, description, imageName));
        let baselineFilePath = getBaselinePath(this.config, filePath);
        let changesFilePath =  getChangesPath(this.config, filePath);

        let visualRegressionPath = getVisualRegressionPath(this.config);
        await this._createFileStructure(visualRegressionPath);

        let hasBaseline = this._checkForBaseline(baselineFilePath);
        let savePath = hasBaseline ? changesFilePath : baselineFilePath;

        await this.browser.executeScript(SCROLL_TO_TOP);
        await this.browser.sleep(1000);

        let rawPngData = await this.browser.takeScreenshot();
        await this._saveScreenshot(savePath, updateAreas(rawPngData, this.areas, pixelRatio));

        let result = true;
        try {
            if (hasBaseline) {
                await checkDiff(this.config, fileStructure, filePath);
            }
        } catch (error) {
            result = false;
            throw error;
        } finally {
            this.areas = [];
        }
        return result;
    }

    _checkForBaseline (baselineFilePath) {
        return !!fileStructure.allFilesByPath[baselineFilePath];
    }

    _createFilePath (filePath) {
        return `${filePath}${PNGFile.prototype.extension}`;
    }

    async _createFileStructure (visualRegressionPath) {
        if (fileStructure) {
            return fileStructure;
        }
        fileStructure = new FileStructure(visualRegressionPath);
        fileStructure.addFileType(DiffPNGFile);
        fileStructure.addFileType(PNGFile);
        await fileStructure.read();
        return fileStructure;
    }

    async _getElementSize (element) {
        let location = await element.getLocation();
        let left = location.x;
        let top = location.y;
        let size = await element.getSize();
        let right = left + size.width;
        let bottom = top + size.height;
        return { left, top, right, bottom };
    }

    _saveScreenshot (savePath, png) {
        let pngFile = fileStructure.allFilesByPath[savePath] || new PNGFile(savePath, fileStructure);
        return pngFile.save(png);
    }
}
