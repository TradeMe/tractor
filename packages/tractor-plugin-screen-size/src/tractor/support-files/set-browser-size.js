// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { ScreenSize, createTag } from '@tractor-plugins/screen-size';

module.exports = function () {
    let browser = global.browser;
    let config = getConfig();

    let screenSize = new ScreenSize(browser, config);

    Object.keys(config.screenSizes)
    .forEach(size => {
        this.Before({ tags: [createTag(size)] }, () => {
            return screenSize.setSize(size);
        });
    });
}
