// Utilities:
import os from 'os';
import path from 'path';

// Dependencies:
import childProcess from 'child_process';

// Constants:
const TRACTOR_PLUGIN_REGEX = new RegExp(`(tractor-plugin[^${path.sep}]*$)`);
const TRACTOR_PLUGIN_LOADER = 'tractor-plugin-loader';

let plugins = loadPlugins();

export function getPluginDescriptions () {
    return plugins.map(plugin => plugin.description);
}

export function getPlugins () {
    return plugins.map(plugin => plugin.plugin);
}

function loadPlugins () {
    let pluginNames = getInstalledPluginNames();

    return pluginNames
    .map(pluginName => {
        let pluginExport;
        try {
            pluginExport = require(pluginName);
            pluginExport = pluginExport.default ? pluginExport.default : pluginExport;
            pluginExport.name = pluginName;
        } catch (e) {
            throw new Error(`could not require ${pluginName}`);
        }
    })
    .filter(pluginExport => {
        let { description, name, plugin } = pluginExport;
        if (!description) {
            console.error(`'${name}' has no description.`)
        }
        if (!plugin) {
            console.error(`'${name}' has no plugin function.`)
        }
        return plugin && description;
    });
}

function getInstalledPluginNames () {
    let ls = childProcess.spawnSync('npm', ['ls', '--depth=0', '--parseable']);
    let errorText = ls.stderr.toString().trim();

    if (errorText && !errorText.startsWith('npm ERR! extraneous')) {
        throw new Error(errorText);
    }

    let allModulePaths = ls.stdout.toString().trim().split(os.EOL);

    let moduleNames = allModulePaths
    .filter(modulePath => modulePath.match(TRACTOR_PLUGIN_REGEX))
    .map(modulePath => {
        let [, moduleName] = modulePath.match(TRACTOR_PLUGIN_REGEX);
        return moduleName;
    })
    .filter(modulePath => modulePath !== TRACTOR_PLUGIN_LOADER);

    return moduleNames
}
