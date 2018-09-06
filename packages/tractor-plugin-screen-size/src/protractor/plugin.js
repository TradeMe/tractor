// Dependencies:
import { mocha } from './hooks';

export function plugin (protractorConfig) {
    protractorConfig.plugins = protractorConfig.plugins || [];

    if (protractorConfig.framework === 'mocha') {
        mocha(protractorConfig);
    }

    return protractorConfig;
}
