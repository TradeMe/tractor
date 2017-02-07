// Utilities:
import Promise from 'bluebird';

// Dependencies:
import { info } from 'tractor-logger';
import tractorPluginLoader from 'tractor-plugin-loader';

export function initialisePlugins () {
    let plugins = tractorPluginLoader.getPlugins();
    return Promise.map(plugins, plugin => {
        info(`Initialising ${plugin.name}`);
        return plugin.init();
    });
}
