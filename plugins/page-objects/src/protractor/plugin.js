// Dependencies:
import { addGroupHelpers } from './group-helpers';
import { addInputHelpers } from './input-helpers';
import { addPseudoElementHelpers } from './pseudo-element-helpers';
import { addSelectHelpers } from './select-helpers';

export function plugin (protractorConfig) {
    protractorConfig.plugins = protractorConfig.plugins || [];

    protractorConfig.plugins.push({
        inline: {
            onPrepare () {
                addGroupHelpers();
                addInputHelpers();
                addPseudoElementHelpers();
                addSelectHelpers();
            }
        }
    });

    return protractorConfig;
}
