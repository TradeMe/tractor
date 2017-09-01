// Utilities:
import Promise from 'bluebird';

// Dependencies:
import { info } from 'tractor-logger';

export function initialisePlugins (di, plugins) {
    return Promise.map(plugins, plugin => {
        info(`Initialising tractor-plugin-${plugin.name}`);
        return di.call(plugin.init);
    });
}
initialisePlugins['@Inject'] = ['di', 'plugins'];
