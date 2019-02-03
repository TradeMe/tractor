// Constants:
const TRACTOR_PLUGINS_SCOPE = '@tractor-plugins';
const NODE_MODULES = 'node_modules';

// Utilities:
import * as fs from 'fs';
import * as path from 'path';

// Dependencies:
// HACK:
// The types for 'camel-case', 'param-case', and 'title-case' are a bit borked:
// tslint:disable:no-require-imports
import camelCase = require('camel-case');
import paramCase = require('param-case');
import titleCase = require('title-case');
// tslint:enable:no-require-imports

import * as findUp from 'find-up';
import * as pkgUp from 'pkg-up';
import { Config } from 'protractor';
import * as resolveFrom from 'resolve-from';
import { TractorDescriptionInternal, TractorPluginInternal, UserTractorPluginESM, UserTractorPluginModule } from './tractor-plugin';

// Errors:
import { TractorError } from '@tractor/error-handler';

export function requirePlugins (cwd: string, enabledPlugins: Array<string> = []): Array<TractorPluginInternal> {
    return getInstalledPluginNames(cwd)
    .filter(pluginName => !enabledPlugins.length || enabledPlugins.includes(pluginName))
    .map(pluginName => {
        const fullName = `${TRACTOR_PLUGINS_SCOPE}/${pluginName}`;
        try {
            const modulePath = resolveFrom(cwd, fullName);
            const userPlugin = require(modulePath) as UserTractorPluginModule;

            const plugin = isESM(userPlugin) ? userPlugin.default : userPlugin;

            if (!plugin.description) {
                plugin.description = {
                    actions: []
                };
            }

            const packagePath = pkgUp.sync(modulePath);
            (plugin.description as TractorDescriptionInternal).version = (require(packagePath) as { version: string }).version;

            (plugin as TractorPluginInternal).fullName = fullName;
            (plugin as TractorPluginInternal).name = pluginName;
            return plugin as TractorPluginInternal;
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
            plugin.create = (): void => void 0;
        }
        if (!plugin.init) {
            plugin.init = (): void => void 0;
        }
        if (!plugin.plugin) {
            plugin.plugin = (config: Config): Config => config;
        }
        if (!plugin.run) {
            plugin.run = (): void => void 0;
        }
        if (!plugin.serve) {
            plugin.serve = (): void => void 0;
        }
        if (!plugin.upgrade) {
            plugin.upgrade = (): void => void 0;
        }

        return plugin;
    });
}

function getInstalledPluginNames (cwd: string): Array<string> {
    const nodeModulesDirs: Array<string> = [];
    let closest = findNodeModules(cwd);
    while (closest !== null) {
        try {
            nodeModulesDirs.push(...fs.readdirSync(path.join(closest, TRACTOR_PLUGINS_SCOPE)));
        } catch {
            // No plugins installed at this level, moving on.
        }
        closest = findNodeModules(path.resolve(closest, '../../'));
    }
    return Array.from(new Set(nodeModulesDirs));
}

function findNodeModules (from: string): string | null {
    return findUp.sync(NODE_MODULES, { cwd: from });
}

function isESM (plugin: UserTractorPluginModule): plugin is UserTractorPluginESM {
    return !!(plugin as UserTractorPluginESM).default;
}
