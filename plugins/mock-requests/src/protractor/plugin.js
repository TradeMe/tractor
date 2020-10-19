// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { serve, close } from './server';
import { useMochaHook } from '@phenomnomnominal/protractor-use-mocha-hook';
import { browser } from 'protractor';

export function plugin (protractorConfig) {
    let tractorConfig = getConfig();
    protractorConfig.plugins = protractorConfig.plugins || [];

    protractorConfig.plugins.push({
        inline: {
            setup () {

                if (tractorConfig.mockRequests.mode === 'proxy') {
                    return serve(global.browser.baseUrl, tractorConfig.mockRequests);
                } else if (tractorConfig.mockRequests.mode === 'serviceworker') {
                    useMochaHook('before', async function () {
                        /* eslint-disable no-undef */
                        return await browser.driver.get(protractor.browser.baseUrl + tractorConfig.mockRequests.serviceWorkerInstallRoute);
                    });
                }

                return Promise.resolve();
            },
            postTest () {
                global.mockRequests.clear();
            },
            teardown () {
                if (tractorConfig.mockRequests.mode === 'proxy') {
                    return close();
                }
                return Promise.resolve();
            }
        }
    });

    return protractorConfig;
}
