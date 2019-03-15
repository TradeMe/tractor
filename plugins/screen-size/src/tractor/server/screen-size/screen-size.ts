// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { info } from '@tractor/logger';
import { ProtractorBrowser } from 'protractor';
import { ISize } from 'selenium-webdriver';
import { TractorScreenSizeConfigInternal } from '../../screen-size-config';

// Constants:
export const MAXIMIZE = 'maximize';
export const DEFAULT = 'default';

export class ScreenSize {
    public constructor (
        private readonly _browser: ProtractorBrowser,
        private readonly _config: TractorScreenSizeConfigInternal
    ) { }

    public async getHeight (): Promise<number> {
        const { height } = await this._getSize();
        return height;
    }

    public async getScreenHeight (): Promise<number> {
        return this._browser.executeScript('return window.screen.availHeight');
    }

    public async getScreenWidth (): Promise<number> {
        return this._browser.executeScript('return window.screen.availWidth');
    }

    public async getWidth (): Promise<number> {
        const { width } = await this._getSize();
        return width;
    }

    public async maximise (): Promise<void> {
        const screenHeight = await this.getScreenHeight();
        const screenWidth = await this.getScreenWidth();
        // Cannot guarantee that `.window().maximize()` will be able to set to the
        // total available height, so trying one pixel less??? 🙃🙃🙃
        return this._browser.driver.manage().window().setSize(screenWidth - 1, screenHeight - 1);
    }

    public async setSize (size: string = DEFAULT): Promise<void> {
        const dimensions = this._config.screenSizes[size];

        if (!dimensions) {
            throw new TractorError(`Cannot find a screen size configuration for "${size}"`);
        }

        if (dimensions === MAXIMIZE) {
            return this.maximise();
        }

        const { height, width } = dimensions;

        await this._browser.driver.manage().window().setSize(width, height);
        const actualSize = await this._getSize();
        const actualHeight = actualSize.height;
        const actualWidth = actualSize.width;
        if (actualHeight !== height) {
            info(`Browser height could not be set to "${height}px". Actual height is ${actualHeight}px`);
        }
        if (actualWidth !== width) {
            info(`Browser width could not be set to "${width}px". Actual width is ${actualWidth}px`);
        }
    }

    private async _getSize (): Promise<ISize> {
        return this._browser.driver.manage().window().getSize() as Promise<ISize>;
    }
}
