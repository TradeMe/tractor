// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { info } from '@tractor/logger';

// Constants:
const DEFAULT_HEIGHT = 1000;

export class ScreenSize {
    constructor (browser, config) {
        this.browser = browser;
        this.config = config;
    }

    async setSize (size) {
        let dimensions = this.config.screenSizes[size];

        if (!dimensions) {
            throw new TractorError(`Cannot find a screen size configuration for "${size}"`);
        }

        let { height, width } = dimensions;

        if (!width) {
            width = dimensions;
        }

        if (!height) {
            height = DEFAULT_HEIGHT;
        }

        await this.browser.driver.manage().window().setSize(width, height);
        const actualSize = await this.getSize();
        const actualHeight = actualSize.height;
        const actualWidth = actualSize.width;
        if (actualHeight !== height) {
            info(`Browser height could not be set to "${height}px". Actual height is ${actualHeight}px`);
        }
        if (actualWidth !== width) {
            info(`Browser width could not be set to "${width}px". Actual width is ${actualWidth}px`);
        }
    }

    async getHeight () {
        const { height } = await this.getSize();
        return height;
    }

    async getWidth () {
        const { width } = await this.getSize();
        return width;
    }

    getSize () {
        return this.browser.driver.manage().window().getSize();
    }
}
