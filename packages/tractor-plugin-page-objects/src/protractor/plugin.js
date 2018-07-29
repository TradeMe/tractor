// Dependencies:
import { addGroupHelpers } from './group-helpers';
import { addInputHelpers } from './input-helpers';
import { addPseudoElementHelpers } from './pseudo-element-helpers';
import { addSelectHelpers } from './select-helpers';
import { serialiseCommands } from './serialise-commands';

export function plugin (protractorConfig) {
    protractorConfig.plugins = protractorConfig.plugins || [];

    protractorConfig.plugins.push({
        inline: {
            onPrepare () {
                serialiseCommands();

                addGroupHelpers();
                addInputHelpers();
                addPseudoElementHelpers();
                addSelectHelpers();
            }
        }
    });

    return protractorConfig;
}
