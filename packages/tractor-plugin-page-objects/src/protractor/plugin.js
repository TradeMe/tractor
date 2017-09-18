// Dependencies:
import { addSelectHelpers } from './select-helpers';

export function plugin (protractorConfig) {
    protractorConfig.plugins = protractorConfig.plugins || [];

    protractorConfig.plugins.push({
        inline: {
            onPrepare () {
                addSelectHelpers();
            }
        }
    });

    return protractorConfig;
}
