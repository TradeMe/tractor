// Dependencies:
const { loadConfig } = require('@tractor/config-loader');
const { container } = require('@tractor/dependency-injection');
const { loadPlugins } = require('@tractor/plugin-loader');

const { version } = require('../package.json');

export class Tractor {
    constructor (cwd, configPath) {
        this.config = loadConfig(cwd, configPath);
        this.plugins = loadPlugins(this.config);
        this.version = version;

        this.di = this._setUpDI({ 
            config: this.config,
            plugins: this.plugins,
            version: this.version,
        });
    }

    plugin (protractorConfig) {
        protractorConfig.params = protractorConfig.params || {};
        protractorConfig.params.debug = false;
        this.plugins.forEach(plugin => plugin.plugin(protractorConfig));
        return protractorConfig;
    }

    call (func) {
        this.di.call(func);
    }

    _setUpDI (constants) {
        const di = container();
        di.constant(constants);
        return di;
    }
}
