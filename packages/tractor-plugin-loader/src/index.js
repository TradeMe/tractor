// Utilities:
import module from 'module';
import os from 'os';
import path from 'path';

// Dependencies:
import childProcess from 'child_process';
import * as tractorConfigLoader from 'tractor-config-loader';

// Constants:
const NPM_EXTRANEOUS_ERROR = 'npm ERR! extraneous';
const NPM_PEER_DEP_ERROR = 'npm ERR! peer dep missing';
const TRACTOR_PLUGIN_REGEX = new RegExp(`(tractor-plugin[^${path.sep}]*$)`);
const TRACTOR_PLUGIN_LOADER = 'tractor-plugin-loader';
const config = tractorConfigLoader.loadConfig();

let plugins = loadPlugins();

export function getPluginDescriptions () {
    return plugins.map(plugin => plugin.description);
}

export function getPlugins () {
    plugins.forEach(plugin => {
        let create = plugin.create;
        plugin.create = (browser) => create(browser, config);
    });
    return plugins;
}

function loadPlugins () {
    let pluginNames = getInstalledPluginNames();

    return pluginNames
    .map(pluginName => {
        let plugin;
        try {
            let modulePath = path.resolve(process.cwd(), 'node_modules', pluginName);
            plugin = module._load(modulePath);
            plugin = plugin.default ? plugin.default : plugin;
            plugin.name = pluginName;
            return plugin;
        } catch (e) {
            throw new Error(`could not require ${pluginName}`);
        }
    })
    .filter(plugin => {
        let { description, name, create } = plugin;
        if (!description) {
            console.error(`'${name}' has no description.`)
        }
        if (!create) {
            console.error(`'${name}' has no create function.`)
        }
        return create && description;
    });
}

function getInstalledPluginNames () {
    let ls = childProcess.spawnSync('npm', ['ls', '--depth=0', '--parseable']);
    let errors = ls.stderr.toString().trim().split(os.EOL);

    errors = errors
    .filter((error) => {
        return error && !(error.startsWith(NPM_EXTRANEOUS_ERROR) || error.startsWith(NPM_PEER_DEP_ERROR));
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
