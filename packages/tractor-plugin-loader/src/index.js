// Dependencies:
import { loadPlugins } from './load-plugins';

let plugins;
export function getPlugins () {
    plugins = plugins || loadPlugins();
    return plugins;
}
