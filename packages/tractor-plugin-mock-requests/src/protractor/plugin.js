// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { serve, close } from './server';

export function plugin (protractorConfig) {
    let tractorConfig = getConfig();
    protractorConfig.plugins = protractorConfig.plugins || [];

    protractorConfig.plugins.push({
        inline: {
            setup () {
                return serve(global.browser.baseUrl, tractorConfig.mockRequests);
            },
            teardown () {
                return close();
            }
        }
    });

    return protractorConfig;
}
