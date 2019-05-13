// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { info } from '@tractor/logger';
import { browser } from 'protractor';
import { config } from '../tractor/config';
import { ScreenSize } from './screen-size/screen-size';

export async function setSizeFromName (name: string): Promise<void> {
    const tractorConfig = config(getConfig());

    const screenSize = new ScreenSize(browser, tractorConfig);
    const nameChunks = name.split(/\s/);
    const matchingSize = Object.keys(tractorConfig.screenSizes).find(size => nameChunks.includes(`#${size}`));
    info(`Setting screen size from tag: "${matchingSize}".`);
    return screenSize.setSize(matchingSize);
}
