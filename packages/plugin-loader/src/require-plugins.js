// Constants:
const TRACTOR_PLUGINS_SCOPE = '@tractor-plugins';
const NODE_MODULES = 'node_modules';

// Utilities:
import fs from 'fs';
import path from 'path';

// Dependencies:
import camelCase from 'camel-case';
import findUp from 'find-up';
import paramCase from 'param-case';
import pkgUp from 'pkg-up';
import resolveFrom from 'resolve-from';
import titleCase from 'title-case';

// Errors:
import { TractorError } from '@tractor/error-handler';

export function requirePlugins (cwd, enabledPlugins) {
    return getInstalledPluginNames(cwd)
    .filter(pluginName => {
        return !enabledPlugins || enabledPlugins.includes(pluginName);
    })
    .map(pluginName => {
        const fullName = `${TRACTOR_PLUGINS_SCOPE}/${pluginName}`;
        try {
            const modulePath = resolveFrom(cwd, fullName);
            let plugin = require(modulePath);
      
            plugin = plugin.default ? plugin.default : plugin;

            if (!plugin.description) {
                plugin.description = {};
            }

            const packagePath = pkgUp.sync(modulePath);
            plugin.description.version = require(packagePath).version;

            plugin.fullName = fullName;
            plugin.name = pluginName;
            return plugin;
        } catch (e) {
            throw new TractorError(`could not require '${fullName}'`);
        }
    })
    .map(plugin => {
        const { description, name } = plugin;
        description.name = titleCase(name);
        description.variableName = camelCase(name);
        description.url = paramCase(name);

        const { fullName } = plugin;
        const modulePath = resolveFrom(cwd, fullName);
        const script = path.resolve(modulePath, '../client/bundle.js');

        try {
            fs.accessSync(script);
            plugin.script = script;
            plugin.description.hasUI = true;
        } catch (e) {
            plugin.description.hasUI = false;
        }

        if (!plugin.create) {
            plugin.create = () => {};
        }
        if (!plugin.init) {
            plugin.init = () => {};
        }
        if (!plugin.plugin) {
            plugin.plugin = () => {};
        }
        if (!plugin.run) {
            plugin.run = () => {};
        }
        if (!plugin.serve) {
            plugin.serve = () => {};
        }
        if (!plugin.upgrade) {
            plugin.upgrade = () => {};
        }

        return plugin;
    });
}

function getInstalledPluginNames (cwd) {
    const nodeModulesDirs = [];
    let closest = findNodeModules(cwd);
    while (closest) {
        try {
            nodeModulesDirs.push(...fs.readdirSync(path.join(closest, TRACTOR_PLUGINS_SCOPE)));
        } catch { 
            // No plugins installed at this level, moving on.
        }
        closest = findNodeModules(path.resolve(closest, '../../'));
    }
    return Array.from(new Set(nodeModulesDirs));
}

function findNodeModules (from) {
    return findUp.sync(NODE_MODULES, { cwd: from });
}
