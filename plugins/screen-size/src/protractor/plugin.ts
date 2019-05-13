// Dependencies:
import { Config } from 'protractor';
import { setupMocha } from './frameworks/mocha';

export function plugin (protractorConfig: Config): Config {
    protractorConfig.plugins = protractorConfig.plugins || [];

    if (protractorConfig.framework === 'mocha') {
        protractorConfig.plugins.push({
            inline: {
                setup (): void {
                    setupMocha();
                }
            }
        });
    }

    return protractorConfig;
}
