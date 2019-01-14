// Polyfill:
// Ignoring polyfill from coverage as it should hopefully go away soon:
/* istanbul ignore next */
if (!global._babelPolyfill) {
    require('@babel/polyfill');
}

// Dependencies:
import { loadPlugins } from './load-plugins';

let plugins;
export function getPlugins (directory) {
    plugins = plugins || loadPlugins(directory || process.cwd());
    return plugins;
}

export function plugin (protractorConfig) {
    getPlugins().forEach(plugin => plugin.plugin(protractorConfig));
    return protractorConfig;
}
