// Dependencies:
import { addActionHelpers } from './action-helpers';

export function plugin (protractorConfig) {
    protractorConfig.plugins = protractorConfig.plugins || [];

    protractorConfig.plugins.push({
        inline: {
            onPrepare () {
                addActionHelpers();
            }
        }
    });

    return protractorConfig;
}
