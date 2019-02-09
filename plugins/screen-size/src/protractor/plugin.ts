// Dependencies:
import { Config } from 'protractor';
import { mocha } from './hooks';

export function plugin (protractorConfig: Config): Config {
    protractorConfig.plugins = protractorConfig.plugins || [];

    if (protractorConfig.framework === 'mocha') {
        mocha(protractorConfig);
    }

    return protractorConfig;
}
