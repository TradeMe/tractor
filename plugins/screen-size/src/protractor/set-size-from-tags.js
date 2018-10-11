// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { ScreenSize } from '../tractor/server/screen-size/screen-size';

export function setSizeFromName (name) {
    let { browser } = global;
    let config = getConfig();

    const screenSize = new ScreenSize(browser, config);
    const nameChunks = name.split(/\s/);
    const size = Object.keys(config.screenSizes).find(size => {
        return nameChunks.includes(`#${size}`);
    });
    if (size) {
        return screenSize.setSize(size);
    }
}
