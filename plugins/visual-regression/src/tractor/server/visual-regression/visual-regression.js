// Dependencies:
import path from 'path';
import { FileStructure } from '@tractor/file-structure';
import { checkDiff } from '../differ/check-diff';
import { createIgnoredElement, createIncludedElement, excludeElements, validateElements } from './elements';
import { DiffPNGFile } from '../files/diff-png-file';
import { PNGFile } from '../files/png-file';
import { getBaselinePath, getChangesPath, getVisualRegressionPath } from '../utilities';

// Constants:
const GET_PIXEL_RATIO = 'return window.devicePixelRatio';
const GET_WINDOW_SCROLL = 'return { y: window.scrollY || window.pageYOffset || 0, x: window.scrollX || window.pageXOffSet || 0 };';
const SCROLL_TO_ELEMENT = 'return arguments[0].scrollIntoView();';
let fileStructure;

export class VisualRegression {
    constructor (
        browser,
        config
    ) {
        this.browser = browser;
        this.config = config;
        this.elements = [];
    }

    async ignoreElement (element) {
        this.elements.push(createIgnoredElement(element));
    }

    async includeElement (element) {
        this.elements.push(createIncludedElement(element));
    }

    async takeScreenshotOfElement (element, name, description) {
        await this.includeElement(element);
        return this.takeScreenshot(name, description);
    }

    async takeScreenshot (name, description) {
        const pixelRatio = await this.browser.executeScript(GET_PIXEL_RATIO);
        const capabilities = await this.browser.getCapabilities();
        const platform = capabilities.get('platform');
        const browser = capabilities.get('browserName');

        const imageName = `${platform} - ${browser} @ ${pixelRatio}x`;

        const filePath = this._createFilePath(path.join(name, description, imageName));
        const baselineFilePath = getBaselinePath(this.config, filePath);
        const changesFilePath =  getChangesPath(this.config, filePath);

        const visualRegressionPath = getVisualRegressionPath(this.config);
        await this._createFileStructure(visualRegressionPath);

        const hasBaseline = this._checkForBaseline(baselineFilePath);
        const savePath = hasBaseline ? changesFilePath : baselineFilePath;

        const [element] = this.elements.filter(element => element.included).map(element => element.element);
        await this.browser.executeScript(SCROLL_TO_ELEMENT, await element.getWebElement());
        await this.browser.sleep(1000);

        validateElements(this.elements, this._getWindowSize());

        const rawPngData = await this.browser.takeScreenshot();
        const screenShot = await excludeElements(rawPngData, this.elements, await this._getWindowScroll(), pixelRatio);
        await this._saveScreenshot(screenShot, savePath);

        let result = true;
        try {
            if (hasBaseline) {
                await checkDiff(this.config, fileStructure, filePath);
            }
        } catch (error) {
            result = false;
            throw error;
        } finally {
            this.elements = [];
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

    async _getWindowSize () {
        return this.browser.driver.manage().window().getSize();
    }

    async _getWindowScroll () {
        return this.browser.executeScript(GET_WINDOW_SCROLL);
    }

    _saveScreenshot (png, savePath) {
        const pngFile = fileStructure.allFilesByPath[savePath] || new PNGFile(savePath, fileStructure);
        return pngFile.save(png);
    }
}
