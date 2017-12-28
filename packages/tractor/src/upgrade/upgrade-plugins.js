// Dependencies:
import Promise from 'bluebird';
import { info } from 'tractor-logger';

export function upgradePlugins (di, plugins) {
    return Promise.map(plugins, plugin => {
        info(`Upgrading tractor-plugin-${plugin.name} files...`);
        return di.call(plugin.upgrade);
    });
}
upgradePlugins['@Inject'] = ['di', 'plugins'];
