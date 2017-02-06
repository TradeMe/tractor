// Constants:
const NPM_EXTRANEOUS_ERROR = 'npm ERR! extraneous';
const NPM_INVALID_ERROR = 'npm ERR! invalid';
const NPM_PEER_DEP_ERROR = 'npm ERR! peer dep missing';
const TRACTOR_PLUGIN_LOADER = 'tractor-plugin-loader';
const TRACTOR_PLUGIN_MODULE_NAME_REGEX = new RegExp(`(tractor-plugin[^${path.sep}]*$)`);
const TRACTOR_PLUGIN_NAME_REGEX = /tractor-plugin-(.*)/;

// Utilities:
import childProcess from 'child_process';
import fs from 'fs';
import module from 'module';
import os from 'os';
import path from 'path';

// Dependencies:
import camelCase from 'camel-case';
import paramCase from 'param-case';
import sentenceCase from 'sentence-case';
import { getConfig } from 'tractor-config-loader';

// Errors:
import { TractorError } from 'tractor-error-handler';

class TractorPluginLoader {
    get plugins () {
        this._plugins = this._plugins || decoratePlugins(loadPlugins(), getConfig());
        return this._plugins;
    }

    getPlugins () {
        return this.plugins;
    }

    getPluginDescriptions () {
        return this.plugins.map(plugin => plugin.description);
    }
}

function loadPlugins () {
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
        let { description, fullName, create } = plugin;
        if (!description) {
            throw new TractorError(`'${fullName}' has no \`description\``);
        }
        if (!create) {
            throw new TractorError(`'${fullName}' has no \`create\` function`);
        }
        return create && description;
    });
}

function decoratePlugins (plugins, config) {
    plugins.forEach(plugin => {
        let { description, name } = plugin;
        description.name = sentenceCase(name);
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

        let addHooks = plugin.addHooks || (() => {});
        plugin.addHooks = cucumber => addHooks(cucumber, config);

        let create = plugin.create;
        plugin.create = browser => create(browser, config);

        let init = plugin.init || (() => {});
        plugin.init = () => init(config);

        let serve = plugin.serve || (() => {});
        plugin.serve = application => serve(application, config);
    });
    return plugins;
}

function getInstalledPluginNames () {
    let ls = childProcess.spawnSync('npm', ['ls', '--depth=0', '--parseable']);

    let errors = ls.stderr.toString().trim().split(os.EOL);
    errors = errors
    .filter(error => {
        let isExtraneous = error.startsWith(NPM_EXTRANEOUS_ERROR);
        let isInvalid = error.startsWith(NPM_INVALID_ERROR);
        let isPeerDep =  error.startsWith(NPM_PEER_DEP_ERROR);
        return error && !(isExtraneous || isInvalid || isPeerDep);
    });

    if (errors.length) {
        let [firstError] = errors;
        throw new TractorError(firstError);
    }

    let allModulePaths = ls.stdout.toString().trim().split(os.EOL);

    let moduleNames = allModulePaths
    .filter(modulePath => modulePath.match(TRACTOR_PLUGIN_MODULE_NAME_REGEX))
    .map(modulePath => {
        let [, moduleName] = modulePath.match(TRACTOR_PLUGIN_MODULE_NAME_REGEX);
        return moduleName;
    })
    .filter(modulePath => modulePath !== TRACTOR_PLUGIN_LOADER);

    return moduleNames
}

let tractorPluginLoader = new TractorPluginLoader();
export default tractorPluginLoader;
