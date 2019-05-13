// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { info, warn } from '@tractor/logger';
import { ProtractorBrowser } from 'protractor';
import { ISize } from 'selenium-webdriver';
import { TractorScreenSizeConfigInternal } from './screen-size-config';

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
        const window = this._browser.driver.manage().window();
        await window.maximize();
        const { height, width } = await this._getSize();
        const availableHeight = await this.getScreenHeight();
        const availableWidth = await this.getScreenWidth();
        if (height === availableHeight && width === availableWidth) {
            return;
        }
        warn(`Browser could not be maximised. Attempting manual fallback...`);
        await window.setPosition(0, 0);
        await this._setSize(availableWidth - 1, availableHeight - 1);
    }

    public async setSize (size: string = DEFAULT): Promise<void> {
        const dimensions = this._config.screenSizes[size];

        if (!dimensions) {
            throw new TractorError(`Cannot find a screen size configuration for "${size}".`);
        }

        info(`Found matching screen size configuration for "${size}".`);

        if (dimensions === MAXIMIZE) {
            info(`Maximising!`);
            return this.maximise();
        }

        const { height, width } = dimensions;
        await this._setSize(width, height);
    }

    private async _getSize (): Promise<ISize> {
        return this._browser.driver.manage().window().getSize() as Promise<ISize>;
    }

    private async _setSize (width: number, height: number): Promise<void> {
        info(`Setting browser width to "${width}px". Setting browser height to "${height}px".`);
        await this._browser.driver.manage().window().setSize(width, height);
        const actualSize = await this._getSize();
        const actualHeight = actualSize.height;
        const actualWidth = actualSize.width;
        if (actualWidth !== width) {
            warn(`Browser width could not be set to "${width}px". Actual width is ${actualWidth}px.`);
        }
        if (actualHeight !== height) {
            warn(`Browser height could not be set to "${height}px". Actual height is ${actualHeight}px.`);
        }
    }
}
