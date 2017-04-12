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
import readPkgUp from 'read-pkg-up';

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

        plugin.addHooks = plugin.addHooks || (() => {});
        plugin.create = plugin.create || (() => {});
        plugin.init = plugin.init || (() => {});
        plugin.serve = plugin.serve || (() => {});
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
            plugin.fullName = pluginName;
            let [, name] = plugin.fullName.match(TRACTOR_PLUGIN_NAME_REGEX);
            plugin.name = name;
            return plugin;
        } catch (e) {
            throw new TractorError(`could not require '${pluginName}'`);
        }
    })
    .filter(plugin => {
        let { description, fullName } = plugin;
        if (!description) {
            throw new TractorError(`'${fullName}' has no \`description\``);
        }
        return description;
    });
}

function getInstalledPluginNames () {
    let { pkg } = readPkgUp.sync({ cwd: process.cwd() });
    let dependencies = [].concat(Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies));

    let pluginNames = dependencies
    .filter(dependency => dependency.match(TRACTOR_PLUGIN_MODULE_NAME_REGEX))
    .map(dependency => {
        let [, dependencyName] = dependency.match(TRACTOR_PLUGIN_MODULE_NAME_REGEX);
        return dependencyName;
    })
    .filter(dependencyName => dependencyName !== TRACTOR_PLUGIN_LOADER);

    return pluginNames;
}
