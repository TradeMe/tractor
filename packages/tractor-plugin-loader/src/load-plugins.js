// Constants:
const TRACTOR_PLUGIN_LOADER = 'tractor-plugin-loader';
const TRACTOR_PLUGIN_MODULE_NAME_REGEX = /(tractor-plugin-.*$)/;
const TRACTOR_PLUGIN_NAME_REGEX = /tractor-plugin-(.*)/;

// Utilities:
import fs from 'fs';
import module from 'module';
import path from 'path';
import { info } from 'tractor-logger';

// Dependencies:
import camelCase from 'camel-case';
import paramCase from 'param-case';
import titleCase from 'title-case';

// Errors:
import { TractorError } from 'tractor-error-handler';

export function loadPlugins () {
    info('Loading plugins...');
    let plugins = requirePlugins();

    plugins.forEach(plugin => {
        let { description, name } = plugin;
        description.name = titleCase(name);
        description.variableName = camelCase(name);
        description.url = paramCase(name);

        let { fullName } = plugin;
        let script = path.resolve(process.cwd(), path.join('node_modules', fullName, 'dist', 'client', 'bundle.js'));
        try {
            fs.accessSync(script);
            plugin.script = script;
            plugin.description.hasUI = true;
        } catch (e) {
            plugin.description.hasUI = false;
        }

        if (!plugin.create) {
            plugin.create = (() => {});
        }
        if (!plugin.init) {
            plugin.init = (() => {});
        }
        if (!plugin.plugin) {
            plugin.plugin = (() => {});
        }
        if (!plugin.run) {
            plugin.run = (() => {});
        }
        if (!plugin.serve) {
            plugin.serve = (() => {});
        }
        if (!plugin.upgrade) {
            plugin.upgrade = (() => {});
        }
    });
    return plugins;
}

function requirePlugins () {
    let pluginNames = getInstalledPluginNames();

    return pluginNames
    .map(pluginName => {
        let plugin;
        try {
            let modulePath = path.resolve(process.cwd(), path.join('node_modules', pluginName));
            plugin = module._load(modulePath);
            plugin = plugin.default ? plugin.default : plugin;

            if (!plugin.description) {
                plugin.description = {};
            }
            let packagePath = path.join(modulePath, 'package.json');
            plugin.description.version = module._load(packagePath).version;

            plugin.fullName = pluginName;
            let [, name] = plugin.fullName.match(TRACTOR_PLUGIN_NAME_REGEX);
            plugin.name = name;
            return plugin;
        } catch (e) {
            throw new TractorError(`could not require '${pluginName}'`);
        }
    });
}

function getInstalledPluginNames () {
    let pluginNames = fs.readdirSync(path.resolve(process.cwd(), 'node_modules'))
    .filter(dependency => dependency.match(TRACTOR_PLUGIN_MODULE_NAME_REGEX))
    .map(dependency => {
        let [, dependencyName] = dependency.match(TRACTOR_PLUGIN_MODULE_NAME_REGEX);
        return dependencyName;
    })
    .filter(dependencyName => dependencyName !== TRACTOR_PLUGIN_LOADER);

    return pluginNames;
}
