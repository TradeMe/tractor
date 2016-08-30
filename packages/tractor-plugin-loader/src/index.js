// Utilities:
import os from 'os';
import path from 'path';

// Dependencies:
import childProcess from 'child_process';
import * as tractorConfigLoader from 'tractor-config-loader';

// Constants:
const TRACTOR_PLUGIN_REGEX = new RegExp(`(tractor-plugin[^${path.sep}]*$)`);
const TRACTOR_PLUGIN_LOADER = 'tractor-plugin-loader';
const config = tractorConfigLoader.loadConfig();

let plugins = loadPlugins();

export function getPluginDescriptions () {
    return plugins.map(plugin => plugin.description);
}

export function getPlugins () {
    return plugins.map(plugin => {
        let create = plugin.create;
        plugin.create = (browser) => create(browser, config);
    });
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
            return pluginExport;
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
    let errors = ls.stderr.toString().trim().split(os.EOL);

    errors = errors
    .filter((error) => {
        return !(error.startsWith('npm ERR! extraneous') || error.startsWith('npm ERR! peer dep missing'));
    });

    if (errors.length) {
        let [firstError] = errors;
        throw new Error(firstError);
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
