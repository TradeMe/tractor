// Dependencies:
import { info } from '@tractor/logger';

export function upgradePlugins (di, plugins) {
    return Promise.all(plugins.map(plugin => {
        info(`Upgrading tractor-plugin-${plugin.name} files...`);
        return di.call(plugin.upgrade);
    }));
}
upgradePlugins['@Inject'] = ['di', 'plugins'];
