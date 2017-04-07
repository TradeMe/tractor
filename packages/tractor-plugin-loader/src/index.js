// Dependencies:
import { loadPlugins } from './load-plugins';

export function getPlugins () {
    let plugins = getPlugins.plugins || loadPlugins();

    Object.defineProperty(getPlugins, 'plugins', {
        value: plugins,
        configurable: true
    });

    return plugins;
}

export function getPluginDescriptions () {
    return getPlugins().map(plugin => plugin.description);
}
