// Dependencies:
import { addKeyboardHelpers } from './helpers/keyboard-helpers';

export function plugin (protractorConfig) {
    protractorConfig.plugins = protractorConfig.plugins || [];

    protractorConfig.plugins.push({
        inline: {
            onPrepare () {
                const { browser, Key } = global.protractor;
                addKeyboardHelpers(browser, Key);
            }
        }
    });

    return protractorConfig;
}
